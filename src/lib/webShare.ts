export interface ShareDataInput {
  title: string;
  text: string;
  url?: string;
  file?: File;
}

export async function shareVideoOrCard(data: ShareDataInput): Promise<{ success: boolean; method: 'native' | 'fallback' | 'copied'; error?: string }> {
  try {
    // Check if Web Share API is available on device (iOS, Android, macOS Safari/Chrome)
    if (typeof navigator !== 'undefined' && navigator.share) {
      const sharePayload: ShareData = {
        title: data.title,
        text: data.text,
      };

      if (data.url) {
        sharePayload.url = data.url;
      }

      if (data.file && navigator.canShare && navigator.canShare({ files: [data.file] })) {
        sharePayload.files = [data.file];
      }

      await navigator.share(sharePayload);
      return { success: true, method: 'native' };
    }

    // Fallback if URL exists: copy to clipboard
    if (data.url && typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${data.title} - ${data.text}\n${data.url}`);
      return { success: true, method: 'copied' };
    }

    // Fallback if file exists: trigger download
    if (data.file) {
      const url = URL.createObjectURL(data.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true, method: 'fallback' };
    }

    return { success: false, method: 'fallback', error: 'Sharing not supported on this browser' };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      // User cancelled the share dialog
      return { success: false, method: 'native', error: 'Share cancelled' };
    }
    return { success: false, method: 'fallback', error: err instanceof Error ? err.message : 'Share failed' };
  }
}
