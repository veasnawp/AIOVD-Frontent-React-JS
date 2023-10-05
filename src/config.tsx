// const defaultThemeColors = {
// 	blogger: "#ff5722",
// 	link: "#2271b1",
// 	linkHover: "#72aee6",
// };
const defaultThemeColors = {
	blogger: "#ff5722",
	link: "#FD7E14",
	linkHover: "#FFC078",
};

// orange 0
// #FFF4E6 #FFE8CC #FFD8A8 #FFC078 #FFA94D #FF922B #FD7E14 #F76707 #E8590C #D9480F

const themeColors = {
	header: {
		bg: "#1d2327",
		color: "#f0f0f1",
		hoverSectionBG: "#2c3338",
		hoverSectionColor: "rgba(255, 255, 255, 0.3)",
		hoverColor: defaultThemeColors.linkHover,
	},
	navMenu: {
		bg: "#1d2327",
		color: "#f0f0f1",
		iconColor: "#a7aaad",
		activeLinkBg: defaultThemeColors.link,
		hoverLinkColor: defaultThemeColors.linkHover,
		subMenuBg: "#2c3338",
	}, // TODO add nav menu colors here...
};

export { defaultThemeColors, themeColors };
