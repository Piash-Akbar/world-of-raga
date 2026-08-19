export function getOptimizedVideoUrl(videoUrl: string): string {
  if (!videoUrl) return videoUrl;

  const normalized = videoUrl.replace('http://', 'https://');

  if (!normalized.includes('res.cloudinary.com') || !normalized.includes('/video/upload/')) {
    return normalized;
  }

  if (normalized.includes('q_auto') || normalized.includes('f_') || normalized.includes('vc_')) {
    return normalized;
  }

  const [base, rest] = normalized.split('/video/upload/');
  return `${base}/video/upload/q_auto:good,vc_h264,ac_none,f_mp4/${rest}`;
}
