import QuickEventCreation from "@/components/Admin/CreateEvent/QuickEvent";
import useEventForm from "@/hooks/useEventForm";

export default function EventMain(){
    const { formState,
            updateField,
            handleFileUpload,
            loading,
            error } = useEventForm();

    return (
        <div>
            <QuickEventCreation formState={formState} updateField={updateField} handleFileUpload={handleFileUpload} loading={loading} error={error} />
        </div>
    )
}