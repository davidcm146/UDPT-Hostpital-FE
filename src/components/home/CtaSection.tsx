import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"

const CtaSection = () => {
  return (
    <section className="py-20 bg-teal-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Hospital Management?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join the growing number of healthcare institutions that are improving efficiency, patient care, and
            operational excellence with our system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-6 text-lg">Schedule a Demo</Button>
            <Button variant="outline" className="border-white text-white hover:bg-teal-700 px-8 py-6 text-lg">
              Contact Sales
              <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaSection
