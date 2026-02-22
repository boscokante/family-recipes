import { ChatWidget } from '@/components/ai/chat-widget'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-orange-600 mb-4 font-serif">
            Tré Kante
          </h1>
          <p className="text-2xl text-gray-700 mb-2">Family Recipes</p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A collection of treasured recipes passed down through generations
          </p>
        </div>

        <div className="text-center mb-12">
          <a
            href="/recipes"
            className="inline-block bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg"
          >
            Browse All Recipes →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Recipe cards will be dynamically loaded */}
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-orange-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome to Tré Kante
            </h2>
            <p className="text-gray-600">
              Our family recipe collection is growing. Check back soon for delicious recipes!
            </p>
          </div>
        </div>
      </div>
      <ChatWidget />
    </div>
  );
}

