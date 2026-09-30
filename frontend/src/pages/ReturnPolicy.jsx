import '../styles/returnPolicy.css'

const returnSteps = [
	{
		number: '01',
		title: 'Check your order',
		copy: 'Returns are accepted within 7 days of delivery for eligible items.',
	},
	{
		number: '02',
		title: 'Keep it just as it arrived',
		copy: 'The bag must be unused, unwashed, and returned with its tags and original packaging.',
	},
	{
		number: '03',
		title: 'Reach out to us',
		copy: 'Share your order number and a short reason for the return so our team can guide you.',
	},
]

export default function ReturnPolicy() {
	return (
		<main className="return-page">
			<section className="return-hero">
				<p className="return-eyebrow">MyBags care guide</p>
				<h1>Returns made simple.</h1>
				<p className="return-intro">
					We want your new favourite bag to feel right. If it does not, here is everything
					you need to know before sending it back.
				</p>
				<div className="return-note">
					<span className="return-note-mark">↩</span>
					<div>
						<strong>Our return window</strong>
						<p>Start your return within 7 days of delivery.</p>
					</div>
				</div>
			</section>

			<section className="return-content" aria-label="Return policy details">
				<div className="return-section-heading">
					<p className="return-eyebrow">The easy part</p>
					<h2>How to return an item</h2>
				</div>

				<div className="return-steps">
					{returnSteps.map((step) => (
						<article className="return-step" key={step.number}>
							<span className="return-step-number">{step.number}</span>
							<h3>{step.title}</h3>
							<p>{step.copy}</p>
						</article>
					))}
				</div>

				<div className="return-details">
					<article>
						<h3>A few important notes</h3>
						<ul>
							<li>Items showing signs of use, damage, or missing tags may not be accepted.</li>
							<li>Personalised, final-sale, and clearance items are not eligible for return.</li>
							<li>Please pack the item securely so it reaches us in its original condition.</li>
						</ul>
					</article>

					<article className="refund-card">
						<p className="return-eyebrow">Once we receive it</p>
						<h3>Refunds are sent to your original payment method.</h3>
						<p>
							We inspect every return with care. Once approved, your refund is processed and
							may take a few business days to appear, depending on your bank.
						</p>
					</article>
				</div>

				<div className="return-contact">
					<div>
						<p className="return-eyebrow">Need a hand?</p>
						<h2>We are happy to help.</h2>
					</div>
					<a href="mailto:support@mybags.com">Contact support <span aria-hidden="true">→</span></a>
				</div>
			</section>
		</main>
	)
}
