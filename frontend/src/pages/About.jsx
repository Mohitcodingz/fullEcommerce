import '../styles/about.css'

export default function About() {
	return (
		<main className="about-page">
			<section className="about-hero">
				<div>
					<p className="about-eyebrow">The MyBags story</p>
					<h1>Made for the life you carry.</h1>
					<p className="about-lead">
						MyBags brings together useful design, lasting materials, and the small details
						that make an everyday bag feel like your own.
					</p>
				</div>
				<div className="about-mark" aria-hidden="true">M<span>/</span>B</div>
			</section>

			<section className="about-body">
				<div className="about-statement">
					<p className="about-eyebrow">Our point of view</p>
					<h2>A good bag should work hard and still feel effortless.</h2>
				</div>
				<div className="about-copy">
					<p>
						From busy mornings to slow weekends, the right bag keeps pace without asking
						for attention. We choose thoughtful shapes, comfortable carry, and practical
						spaces that make every day a little easier.
					</p>
					<p>
						Every piece is selected with longevity in mind, so you can reach for it often,
						trust it fully, and make it part of your own story.
					</p>
				</div>
			</section>

			<section className="about-values" aria-label="MyBags values">
				<article><strong>01</strong><h3>Useful by design</h3><p>Details that earn their place in your everyday routine.</p></article>
				<article><strong>02</strong><h3>Easy to live with</h3><p>Comfortable, versatile pieces made for repeat wear.</p></article>
				<article><strong>03</strong><h3>Style that stays</h3><p>Quietly distinctive designs that do not date quickly.</p></article>
			</section>
		</main>
	)
}
