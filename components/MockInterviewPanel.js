export default function MockInterviewPanel() {
  return (
    <aside className="hidden w-[275px] shrink-0 rounded-2xl bg-gradient-to-b from-[#eef8ff] via-[#f7efff] to-white p-6 xl:block">

      <div className="text-xl">
        ✣
      </div>

      <h2 className="mt-4 text-sm font-semibold">
        Ace Your Interviews with AI-Powered Mock Sessions!
      </h2>

      <p className="mt-4 text-xs leading-5 text-gray-600">
        Struggling with interview nerves or unsure how to prepare?
        Let our cutting-edge AI mock interviews help you shine!
      </p>

      <hr className="my-5" />

      <h3 className="text-xs font-semibold">
        Why Choose Our AI Mock Interviews?
      </h3>

      <div className="mt-4 space-y-4 text-xs leading-5 text-gray-700">

        <div>
          <strong>Job-Specific Simulations:</strong>

          <p>
            Practice with questions tailored to your target role,
            ensuring relevance and preparation.
          </p>
        </div>

        <div>
          <strong>Actionable Feedback</strong>

          <p>
            Get detailed analysis of your responses and practical,
            step-by-step improvement suggestions.
          </p>
        </div>

        <div>
          <strong>Boost Success Rates:</strong>

          <p>
            Perfect your interview skills and increase your chances
            of landing the job you want.
          </p>
        </div>

      </div>

      <button className="mt-8 w-full rounded-full bg-[#172033] py-3 text-sm text-white">
        ▣ &nbsp; Mock Interview
      </button>

    </aside>
  );
}