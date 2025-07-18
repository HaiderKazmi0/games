export default function About() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">About GameReview Hub</h1>
            
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-lg mb-4">
                    At GameReview Hub, we're passionate about helping gamers discover their next favorite game through honest, 
                    comprehensive reviews. Our platform brings together expert opinions and community insights to create 
                    a trusted space for game recommendations.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">What Sets Us Apart</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>No sponsored content - all reviews are completely unbiased</li>
                    <li>Combination of expert reviews and community ratings</li>
                    <li>Detailed game analysis covering gameplay, graphics, and story</li>
                    <li>Active community of passionate gamers</li>
                    <li>Regular updates with the latest game reviews</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Our Review System</h2>
                <p className="mb-4">
                    We use a comprehensive rating system that evaluates games across multiple categories:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-8">
                    <li>Gameplay mechanics and controls</li>
                    <li>Graphics and visual design</li>
                    <li>Story and narrative</li>
                    <li>Sound design and music</li>
                    <li>Replay value</li>
                </ul>
                {/* Sample Rating Card */}
                <div className="w-32 aspect-[3/4] rounded-lg overflow-hidden bg-gray-800 relative mx-auto shadow-lg">
                    <div className="relative w-full h-40">
                        <img
                            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=facearea&w=400&h=600&q=80"
                            alt="Sample Game"
                            className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                        <h2 className="text-base font-semibold text-white mb-1 line-clamp-2">
                            Sample Game Title
                        </h2>
                        <div className="flex items-center text-xs text-gray-300">
                            <span>Rating: 4.7</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
                <p className="mb-4">
                    We believe in the power of community. Share your thoughts, rate games, and connect with fellow gamers.
                    Your voice matters in helping others discover great games.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="mb-4">
                    Have questions or feedback? We'd love to hear from you!
                </p>
                <p>
                    Email: support@gamereviewhub.com<br />
                    Twitter: @GameReviewHub<br />
                    Discord: Join our community
                </p>
            </section>
        </div>
    );
}