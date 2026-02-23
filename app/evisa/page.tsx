'use client';

import { useLanguage } from '../_components/language-provider';

export default function Evisa() {
  const { t } = useLanguage();

  const steps = Array.from({ length: 18 }, (_, i) => i + 1);

  const stepDescriptions: Record<number, string | React.ReactNode> = {
    1: (
      <>
        Go to{' '}
        <a
          href="https://evisa.gov.vn/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
        >
          evisa.gov.vn
        </a>
      </>
    ),
    2: 'Acknowledge compliance',
    3: 'Upload passport photos',
    4: "Sometimes it'll reject photo based on match with passport photo - feel free to try with another photo",
    5: 'Fill in info - ensure that dates are in DAY / MONTH / YEAR format',
    6: 'Fill in travel dates / ensure dates are correct',
    7: 'Add current local address (where you live)',
    8: 'Fill form with location information. I used fusion resorts as this is where the western wedding will happen. Feel free to use my example as a template.',
    9: 'Acknowledge / review info',
    10: 'Review all info + submit with security code',
    11: 'Confirm code + save electronic document code for later (or it comes in email later)',
    12: 'Review payment',
    13: 'You can pay by credit card, click the relevant payment method (the logo is a button)',
    14: 'Fill in payment info',
    15: 'Acknowledge visa application',
    16: "Look for payment success screen. At this point you're done!",
    17: (
      <>
        You can go to{' '}
        <a
          href="https://evisa.gov.vn/e-visa/search"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
        >
          evisa.gov.vn/e-visa/search
        </a>
        {' '}to check status of your e-visa. Normally this completes within a week or so from your application (and I've gotten an email about it, although they say they will not send you an email).
      </>
    ),
    18: "You can put in the e-visa app number you got in the email and other info to look up your application status",
  };

  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          Vietnam E-Visa Application Guide
        </h1>
        <p className="text-body text-xl text-gray-600">
          Step-by-step instructions for applying for your Vietnam e-visa
        </p>
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-12">
            {steps.map((step) => (
              <div key={step} className="bg-gray-50 p-6 rounded-lg shadow-md">
                <div className="mb-4">
                  <h2 className="text-title text-2xl font-bold text-gray-800 mb-2">
                    Step {step}
                  </h2>
                  {stepDescriptions[step] && (
                    <p className="text-body text-lg text-gray-700">
                      {stepDescriptions[step]}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <img
                    src={`/evisa/step ${step}.png`}
                    alt={`Step ${step} of Vietnam e-visa application`}
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-title text-xl font-bold text-gray-800 mb-4">
              Important Notes
            </h3>
            <ul className="text-body text-lg text-gray-700 space-y-2 list-disc list-inside">
              <li>Apply well in advance of your travel dates</li>
              <li>Processing times can vary, so allow sufficient time</li>
              <li>Double-check all information before submitting</li>
              <li>Keep a copy of your e-visa approval letter</li>
              <li>Check the latest requirements for your country on the official website</li>
            </ul>
            <div className="mt-4">
              <a 
                href="https://evisa.gov.vn/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body text-lg text-blue-600 hover:text-blue-800 hover:underline font-semibold"
              >
                Official E-Visa Website →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
