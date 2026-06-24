// theme/responsive.tsx
import { createContext, useContext } from "react";
import { useWindowDimensions } from "react-native";

type Responsive = {
  bp: {
    isSm: boolean;
    isMd: boolean;
    isLg: boolean;
    isXl: boolean;
    isLandscape: boolean;
  };
  spacing: Record<1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16, number>;
  fontSize: Record<
    "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl",
    number
  >;
  layout: {
    direction: "row" | "column";
    columns: number;
    cardWidth: string;
    width: number;
    height: number;
  };
};

const ResponsiveContext = createContext<Responsive | null>(null);

export function ResponsiveProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width, height } = useWindowDimensions();

  const bp = {
    isSm: width < 360,
    isMd: width >= 360 && width < 600,
    isLg: width >= 600 && width < 900,
    isXl: width >= 900,
    isLandscape: width > height,
  };

  const spacing: Responsive["spacing"] = {
    1: width * 0.01,
    2: width * 0.02,
    3: width * 0.03,
    4: width * 0.04,
    5: width * 0.05,
    6: width * 0.06,
    8: width * 0.08,
    10: width * 0.1,
    12: width * 0.12,
    16: width * 0.16,
  };

  const fontSize: Responsive["fontSize"] = {
    xs: width * 0.03,
    sm: width * 0.035,
    base: width * 0.04,
    lg: width * 0.045,
    xl: width * 0.05,
    "2xl": width * 0.06,
    "3xl": width * 0.075,
    "4xl": width * 0.09,
  };

  const layout: Responsive["layout"] = {
    direction: bp.isLg || bp.isLandscape ? "row" : "column",
    columns: bp.isXl ? 4 : bp.isLg ? 3 : bp.isMd ? 2 : 1,
    cardWidth: bp.isLg ? "48%" : "100%",
    width,
    height,
  };

  return (
    <ResponsiveContext.Provider value={{ bp, spacing, fontSize, layout }}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsive(): Responsive {
  const ctx = useContext(ResponsiveContext);
  if (!ctx)
    throw new Error("useResponsive must be used inside <ResponsiveProvider>");
  return ctx;
}
