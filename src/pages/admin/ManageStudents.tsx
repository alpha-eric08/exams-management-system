import MainLayout from "@/components/layout/MainLayout"
import MobileNavbar from "@/components/layout/MobileNavbar"

const ManageStudents = () => {
  return (
    <>
    <MobileNavbar />
    <MainLayout title="Admin Dashboard">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-maroon mb-4">ManageStudents</h2>
        </div>
        </MainLayout>
    </>
  )
}

export default ManageStudents