import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const prisma = new PrismaClient();

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} = process.env;

interface JwtPayload {
  userId: number;
  role: string;
}

export async function POST(request: NextRequest,response: NextResponse) {
  const { action, email, password, name, role } = await request.json();

  try {
    if (action === "signup") {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: "User already exists." }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: role || "USER",
        },
      });

      return NextResponse.json({ message: "User created successfully.", userId: newUser.id });
    }

    if (action === "login") {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_ACCESS_SECRET!,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      );

      const refreshToken = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_REFRESH_SECRET!,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
      );

      const accessExpiresAt = new Date(Date.now() + parseExpiry(ACCESS_TOKEN_EXPIRY));
      const refreshExpiresAt = new Date(Date.now() + parseExpiry(REFRESH_TOKEN_EXPIRY));

      // Store refresh token in DB
      await prisma.session.create({
        data: {
          sessionToken: accessToken,
          refreshToken,
          userId: user.id,
          expiresAt: accessExpiresAt,
          refreshExpiresAt,
        },
      });

      // Set HTTP-only cookie
      const response = NextResponse.json({ message: "Login successful.", accessToken, userId: user.id, role: user.role });

      response.headers.set(
        "Set-Cookie",
        cookie.serialize("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          expires: refreshExpiresAt,
        })
      );


      return response;
    }

    if (action === "refresh_token") {
      const refreshToken = request.cookies.get("refreshToken")?.value;

      if (!refreshToken) {
        return NextResponse.json({ error: "Refresh token not found." }, { status: 401 });
      }

      const session = await prisma.session.findUnique({ where: { refreshToken } });

      if (!session) {
        return NextResponse.json({ error: "Invalid refresh token." }, { status: 401 });
      }

      // Verify refresh token
      try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET!) as JwtPayload;

        // Generate new tokens
        const newAccessToken = jwt.sign(
          { userId: decoded.userId, role: decoded.role },
          JWT_ACCESS_SECRET!,
          { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        const newRefreshToken = jwt.sign(
          { userId: decoded.userId, role: decoded.role },
          JWT_REFRESH_SECRET!,
          { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        const accessExpiresAt = new Date(Date.now() + parseExpiry(ACCESS_TOKEN_EXPIRY));
        const refreshExpiresAt = new Date(Date.now() + parseExpiry(REFRESH_TOKEN_EXPIRY));

        // Update session with new tokens
        await prisma.session.update({
          where: { id: session.id },
          data: {
            sessionToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresAt: accessExpiresAt,
            refreshExpiresAt,
          },
        });

        const response = NextResponse.json({ accessToken: newAccessToken });

        response.headers.set(
          "Set-Cookie",
          cookie.serialize("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            expires: refreshExpiresAt,
            sameSite: 'None',
          })
        );

        return response;
      } catch (error) {
        return NextResponse.json({ error: "Invalid refresh token." }, { status: 401 });
      }
    }

    if (action === "verify") {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "No token provided." }, { status: 401 });
      }
  
      const token = authHeader.split(" ")[1];
  
      try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET!) as JwtPayload;
  
        // Check if the session exists in the database
        const session = await prisma.session.findFirst({
          where: {
            userId: decoded.userId,
            sessionToken: token,
            expiresAt: {
              gt: new Date(),
            },
          },
        });
  
        if (!session) {
          return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
        }
  
        // Token is valid
        return NextResponse.json({
          success: true,
          message: "Token is valid.",
          userId: decoded.userId,
          role: decoded.role,
        });
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          return NextResponse.json({ error: "Invalid token." }, { status: 401 });
        } else if (error instanceof jwt.TokenExpiredError) {
          return NextResponse.json({ error: "Token has expired." }, { status: 401 });
        } else {
          console.error("Token verification error:", error);
          return NextResponse.json({ error: "An error occurred during token verification." }, { status: 500 });
        }
      }
    }

    if (action === "logout") {
      const refreshToken = request.cookies.get("refreshToken")?.value;

      if (refreshToken) {
        await prisma.session.deleteMany({ where: { refreshToken } });
      }

      const response = NextResponse.json({ message: "Logged out successfully." });

      response.headers.set(
        "Set-Cookie",
        cookie.serialize("refreshToken", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          expires: new Date(0),
        })
      );

      return response;
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }

}

// Helper function to parse expiry string like "15m" or "7d"
function parseExpiry(expiry: string): number {
  const time = parseInt(expiry.slice(0, -1));
  const unit = expiry.slice(-1);

  switch (unit) {
    case "s":
      return time * 1000;
    case "m":
      return time * 60 * 1000;
    case "h":
      return time * 60 * 60 * 1000;
    case "d":
      return time * 24 * 60 * 60 * 1000;
    default:
      throw new Error("Invalid expiry format");
  }
}

