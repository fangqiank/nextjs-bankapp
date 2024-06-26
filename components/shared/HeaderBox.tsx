export const HeaderBox = ({title, subtext, type='title', user}: HeaderBoxProps) => {
	return (
		<div className="header-box">
			<h1 className="header-box-title">
				{title}
				{type === 'greeting' && (
					<span className="text-bankFradient">
						&nbsp;{user}
					</span>
				)}
			</h1>

			<p className="header-box-subtext">{subtext}</p>
		</div>
	)
}