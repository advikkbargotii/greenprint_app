interface TestimonialProps {
  quote: string
  author: {
    name: string
    title: string
    initials: string
  }
}

function Testimonial({ quote, author }: TestimonialProps) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <p className="text-xl text-white mb-6 italic">
          &ldquo;{quote}&rdquo;
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">{author.initials}</span>
          </div>
          <div className="text-left">
            <div className="text-white font-semibold">{author.name}</div>
            <div className="text-gray-300 text-sm">{author.title}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const testimonial = {
  quote: "GreenPrint helped us reduce emissions by 34% in just 2 weeks! The insights are incredible—we never realized how much our deployment strategy was impacting the environment.",
  author: {
    name: "Jane Doe",
    title: "Senior Developer, TechCorp",
    initials: "JD"
  }
}

export default function TestimonialSection() {
  return (
    <div className="max-w-6xl mx-auto">
      <Testimonial
        quote={testimonial.quote}
        author={testimonial.author}
      />
    </div>
  )
}
