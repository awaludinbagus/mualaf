import React from 'react';
import Svg, {
  Path,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  G,
  Ellipse,
  Pattern,
} from 'react-native-svg';
export function Mosque({ width = 350, height = 270 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 390 290">
      <Defs>
        <LinearGradient id="dome" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#D4DCC0" />
          <Stop offset="1" stopColor="#7EAA8B" />
        </LinearGradient>
        <LinearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#A8C4A4" />
          <Stop offset="1" stopColor="#6C9F7E" />
        </LinearGradient>
        <LinearGradient id="tower" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#AEC5A3" />
          <Stop offset=".5" stopColor="#D0D6B6" />
          <Stop offset="1" stopColor="#8BAF8D" />
        </LinearGradient>
        <Pattern id="lattice" width="16" height="16" patternUnits="userSpaceOnUse">
          <Path d="M8 0L16 8 8 16 0 8Z" stroke="#A9CBB0" strokeWidth=".6" fill="none" />
        </Pattern>
      </Defs>
      <Circle cx="226" cy="150" r="125" fill="#4D8061" opacity=".2" />
      <Circle
        cx="226"
        cy="150"
        r="102"
        fill="none"
        stroke="#A8C59B"
        strokeWidth=".6"
        opacity=".18"
      />
      <Circle cx="333" cy="51" r="18" fill="#E5D9A7" />
      <Circle cx="341" cy="44" r="18" fill="#285641" />
      <G fill="#D5DAB4" opacity=".7">
        <Circle cx="125" cy="53" r="1.6" />
        <Circle cx="280" cy="38" r="1.3" />
        <Circle cx="360" cy="110" r="1.4" />
        <Path d="M174 33v8m-4-4h8M309 103v7m-3.5-3.5h7" stroke="#D5DAB4" strokeWidth="1" />
      </G>
      <Ellipse cx="221" cy="276" rx="172" ry="12" fill="#123D30" opacity=".38" />
      <G>
        <Path d="M88 135h25v130H88z" fill="url(#tower)" />
        <Path d="M84 131h33v8H84zM87 177h27v5H87zM85 252h31v12H85z" fill="#C7D1AC" />
        <Path d="M88 129Q86 112 101 101Q116 112 113 129" fill="#A4B894" />
        <Path d="M101 88v14" stroke="#CDCFA5" strokeWidth="2" />
        <Path d="M97 98Q105 101 105 93" fill="none" stroke="#CDCFA5" strokeWidth="2" />
        <Path d="M96 157v-11q5-9 10 0v11" fill="#396B51" />
        <Path d="M95 228v-24q6-13 12 0v24" fill="#648F6C" />
      </G>
      <G>
        <Path d="M318 85h24v179h-24z" fill="url(#tower)" />
        <Path d="M312 82h36v7h-36zM315 138h30v6h-30zM315 254h30v10h-30z" fill="#D1D6B4" />
        <Path d="M318 81Q315 63 330 52Q346 63 342 81" fill="#BEC8A3" />
        <Path d="M330 36v17" stroke="#D6D8AF" strokeWidth="2" />
        <Path d="M326 45Q334 48 335 40" fill="none" stroke="#D6D8AF" strokeWidth="2" />
        <Path d="M325 113V99q5-11 10 0v14" fill="#3D7155" />
        <Path d="M325 181v-20q5-12 10 0v20M325 229v-22q5-12 10 0v22" fill="#668F6D" />
      </G>
      <Path d="M127 196Q123 176 150 162Q176 176 172 196Z" fill="url(#dome)" />
      <Path d="M149 154v10" stroke="#C3CBA5" strokeWidth="2" />
      <Path d="M279 196Q275 173 299 162Q325 176 320 196Z" fill="url(#dome)" />
      <Path d="M298 154v10" stroke="#C3CBA5" strokeWidth="2" />
      <Path d="M117 194h216v73H117z" fill="url(#wall)" />
      <Path d="M113 194h224v7H113z" fill="#C2CBA7" />
      <Path d="M163 163Q146 121 222 90Q298 121 282 163Z" fill="url(#dome)" />
      <Path
        d="M222 91Q183 127 189 162M222 91Q259 127 256 162"
        stroke="#DFDFC0"
        strokeWidth="1"
        fill="none"
        opacity=".4"
      />
      <Path d="M222 70v22" stroke="#DAD5A7" strokeWidth="2" />
      <Path d="M216 75Q231 80 231 64Q226 70 220 65Q216 69 216 75" fill="#E1D9AC" />
      <Rect x="160" y="159" width="124" height="9" rx="2" fill="#CDD2B0" />
      <Path d="M163 168h121v100H163z" fill="url(#wall)" />
      <Path d="M174 177h99v91h-99z" fill="#85AB87" />
      <Path d="M183 268v-58q0-20 40-35q40 15 40 35v58" fill="#527D5C" />
      <Path d="M191 268v-55q0-17 32-29q32 12 32 29v55" fill="#24533D" />
      <Path d="M198 267v-50q0-14 25-25q25 11 25 25v50" fill="url(#lattice)" />
      <Path d="M222 192v75" stroke="#AFBD95" strokeWidth="1" opacity=".5" />
      {[128, 148, 291, 311].map((x) => (
        <Path key={x} d={`M${x} 243v-24q6-14 12 0v24z`} fill="#416F51" />
      ))}
      <Path d="M107 267h238v7H107zM96 274h260v7H96z" fill="#A8BA93" />
      <Path d="M79 281h296v5H79z" fill="#819E7A" />
      <Path
        d="M65 269q-17-28-8-47q16 12 14 28q1-29 17-35q6 24-14 47l-1 12M354 274q-11-25-3-43q13 11 10 29q8-25 20-25q-1 25-21 38"
        fill="#6D9978"
        opacity=".8"
      />
    </Svg>
  );
}
export function BrandMark({ size = 35, light = false }: { size?: number; light?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Rect width="40" height="40" rx="13" fill={light ? '#FFFFFF18' : '#216452'} />
      <Path d="M25 8c-11 1-18 14-10 22 7 7 19 0 17-7-1 5-10 7-14 1-4-6 0-12 7-16z" fill="#E5EAD4" />
      <Path d="M27 11l1.4 3.6L32 16l-3.6 1.4L27 21l-1.4-3.6L22 16l3.6-1.4z" fill="#CCD6A7" />
    </Svg>
  );
}
export function Kaaba({ size = 26, color = '#216452' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path
        d="M5 9L16 4l11 5v17l-11 3-11-3Z"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <Path
        d="M5 9l11 4 11-4M16 13v16M5 14l11 4 11-4M22 22v-4l3-1v4"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
