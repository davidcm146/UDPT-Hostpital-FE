import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHospital } from "@fortawesome/free-solid-svg-icons"

const DoctorNotFound = () => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <FontAwesomeIcon icon={faHospital} className="h-12 w-12" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">No doctors found</h3>
      <p className="text-gray-600">Try adjusting your search criteria or filters to find more doctors.</p>
    </div>
  )
}

export default DoctorNotFound
