import '../styles/disclaimer.css'

export default function Disclaimer() {
	return (
		<main className="disclaimer-page">
			<section className="disclaimer-hero">
				<p className="disclaimer-eyebrow">A clear note from MyBags</p>
				<h1>Good to know.</h1>
				<p>
					We want your shopping experience to feel simple and informed. Here are the
					important details about the information on our website.
				</p>
			</section>

			<section className="disclaimer-list" aria-label="Website disclaimer details">
				<article><span>01</span><div><h2>Product details</h2><p>We work to keep product descriptions, colours, measurements, and images accurate. Small variations may occur because of lighting, screens, and the natural character of some materials.</p></div></article>
				<article><span>02</span><div><h2>Availability and pricing</h2><p>Products, offers, and prices may change without notice. An item shown on the website is not guaranteed to remain available until an order has been confirmed.</p></div></article>
				<article><span>03</span><div><h2>Orders and returns</h2><p>Placing an order does not replace the need to review your order confirmation and our <a href="/returns">return policy</a>. That policy explains eligibility, return timing, and refund processing.</p></div></article>
				<article><span>04</span><div><h2>Website information</h2><p>The information on MyBags is provided for general shopping purposes. We may update, correct, or improve content as products and services change.</p></div></article>
			</section>

			<div className="disclaimer-contact">
				<p>Have a question about an order or product?</p>
				<a href="mailto:support@mybags.com">support@mybags.com <span aria-hidden="true">→</span></a>
			</div>
		</main>
	)
}
