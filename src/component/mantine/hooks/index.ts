import { useMediaQuery } from "@mantine/hooks";

interface UseMediaQueryOptions {
	getInitialValueInEffect: boolean;
}

export const matchesMedia = (
	width: string | number,
	minmax?: "min" | "max",
	initialValue?: boolean,
	getInitialValueInEffect?: UseMediaQueryOptions
): boolean =>
	useMediaQuery(
		`(${minmax || "max"}-width: ${width}px)`,
		initialValue,
		getInitialValueInEffect
	);
