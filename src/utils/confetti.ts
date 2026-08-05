import confetti from 'canvas-confetti';

/**
 * Triggers a beautiful confetti explosion.
 * Uses Google Palette colors matching the design system.
 */
export function triggerTaskConfetti(taskType: 'quick' | 'short_term' | 'long_term' = 'quick') {
  const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4435'];
  
  if (taskType === 'quick') {
    // Task nhỏ: Bắn nhẹ nhàng, ít hạt, hạt nhỏ hơn
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: colors,
      disableForReducedMotion: true,
      zIndex: 9999,
      scalar: 0.8, // Kích thước hạt nhỏ hơn
    });
  } else if (taskType === 'short_term') {
    // Task ngắn hạn: Bắn tiêu chuẩn, rực rỡ
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: colors,
      disableForReducedMotion: true,
      zIndex: 9999,
    });
  } else {
    // Task dài hạn: Lồng lộn, bắn pháo hoa từ 2 bên liên tục trong 2 giây
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors,
        zIndex: 9999,
        disableForReducedMotion: true,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
}
