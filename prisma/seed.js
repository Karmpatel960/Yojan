const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Define city names
  const cities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Ahmedabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Jaipur',
    'Lucknow'
  ];

  // Insert city data
  const cityInserts = cities.map(name => {
    return prisma.city.create({
      data: {
        name
      }
    });
  });

  const createdCities = await Promise.all(cityInserts);

  // Define events data
  const eventsData = [
    { title: 'Tech Conference 2024', description: 'Annual tech conference featuring AI and ML.', date: new Date('2024-09-15T09:00:00Z'), location: 'Mumbai Convention Center', price: 299.99, capacity: 5000 },
    { title: 'Summer Music Festival', description: 'Three-day music festival showcasing various genres.', date: new Date('2024-07-20T12:00:00Z'), location: 'Delhi Central Park', price: 150.00, capacity: 50000 },
    { title: 'Art Exhibition: Modern Masters', description: 'Exhibition of contemporary art from around the world.', date: new Date('2024-08-05T10:00:00Z'), location: 'Bangalore Art Gallery', price: 25.00, capacity: 1000 },
    { title: 'Innovation Summit', description: 'Summit focusing on new innovations in technology.', date: new Date('2024-10-01T09:00:00Z'), location: 'Hyderabad Tech Hub', price: 399.99, capacity: 2000 },
    { title: 'Food Festival', description: 'Annual food festival with diverse cuisines.', date: new Date('2024-11-10T11:00:00Z'), location: 'Ahmedabad Food Street', price: 50.00, capacity: 15000 },
    { title: 'Startup Expo', description: 'Exhibition for startups and entrepreneurs.', date: new Date('2024-12-05T10:00:00Z'), location: 'Chennai Convention Hall', price: 100.00, capacity: 3000 },
    { title: 'Cultural Gala', description: 'Cultural event showcasing traditional arts and performances.', date: new Date('2024-08-20T18:00:00Z'), location: 'Kolkata Cultural Center', price: 75.00, capacity: 2000 },
    { title: 'Music Concert', description: 'Live music concert featuring famous bands.', date: new Date('2024-09-30T20:00:00Z'), location: 'Pune Music Arena', price: 200.00, capacity: 10000 },
    { title: 'Literary Festival', description: 'Festival celebrating literature and authors.', date: new Date('2024-10-15T10:00:00Z'), location: 'Jaipur Literary Hall', price: 125.00, capacity: 1500 },
    { title: 'Health Expo', description: 'Expo focusing on health and wellness.', date: new Date('2024-11-25T09:00:00Z'), location: 'Lucknow Health Center', price: 80.00, capacity: 2500 }
  ];

  // // Insert events data
  // for (const event of eventsData) {
  //   const city = createdCities[Math.floor(Math.random() * createdCities.length)]; // Random city
  //   await prisma.event.create({
  //     data: {
  //       ...event,
  //       cityId: city.id
  //     }
  //   });
  // }

  console.log('Seed data inserted successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
