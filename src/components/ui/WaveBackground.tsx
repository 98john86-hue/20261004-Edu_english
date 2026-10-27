const wavePath = 'M0 40 C 120 10 240 10 360 40 S 600 70 720 40 S 960 10 1080 40 S 1320 70 1440 40 V120 H0 Z';

/** 가로로 두 번 이어 붙인 물결을 -50%까지 이동시켜 끊김 없이 반복 */
function WaveLayer({ className, fill, animation }: { className: string; fill: string; animation: string }) {
  return (
    <div className={`absolute inset-x-0 bottom-0 overflow-hidden ${className}`}>
      <svg viewBox="0 0 2880 120" preserveAspectRatio="none" className={`h-full w-[200%] ${animation}`}>
        <path d={wavePath} fill={fill} />
        <path d={wavePath} fill={fill} transform="translate(1440 0)" />
      </svg>
    </div>
  );
}

/** Hero 하단의 장식용 물결 애니메이션 (prefers-reduced-motion 시 정지) */
export function WaveBackground() {
  return (
    <div aria-hidden="true">
      <WaveLayer className="h-28 opacity-60 sm:h-36" fill="#7dd3fc" animation="animate-wave-slow" />
      <WaveLayer className="h-20 opacity-70 sm:h-28" fill="#5eead4" animation="animate-wave" />
      <WaveLayer className="h-12 sm:h-16" fill="#ffffff" animation="animate-wave-slow" />
    </div>
  );
}
