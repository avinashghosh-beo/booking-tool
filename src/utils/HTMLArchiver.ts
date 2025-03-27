import JSZip from "jszip";

export class HTMLArchiver {
  private zip: JSZip;
  private usedNames: Set<string>;

  constructor() {
    this.zip = new JSZip();
    this.usedNames = new Set<string>();
  }

  private getCleanFileName(url: string): string {
    try {
      // Extract filename without extension from URL
      const urlObj = new URL(url);
      let filename: string = urlObj.pathname.split("/").pop() || "image";

      // Remove extension and query parameters
      filename = filename.split(/[#?./]/)[0];

      // If filename is empty, generate a name
      if (!filename) {
        filename = `image${this.usedNames.size + 1}`;
      }

      // Handle duplicate names
      let uniqueName: string = `${filename}.jpg`;
      let counter: number = 1;

      while (this.usedNames.has(uniqueName)) {
        uniqueName = `${filename}_${counter}.jpg`;
        counter++;
      }

      this.usedNames.add(uniqueName);
      return uniqueName;
    } catch (error) {
      // Fallback for invalid URLs
      const fallbackName: string = `image${this.usedNames.size + 1}.jpg`;
      this.usedNames.add(fallbackName);
      return fallbackName;
    }
  }

  async createArchive(html: string, onProgress: (progress: number) => void = () => {}, portalId: string): Promise<void> {
    try {
      const pattern: RegExp = /<img[^>]*?src\s*=\s*["']([^"']*?)["'][^>]*?>/gi;
      const images: RegExpMatchArray[] = Array.from(html.matchAll(pattern));
      let updatedHtml: string = html;
      let processed: number = 0;

      await Promise.all(
        images.map(async ([full, src]: RegExpMatchArray) => {
          try {
            const url: string = src.startsWith("http") ? src : src.startsWith("//") ? `https:${src}` : new URL(src, window.location.origin).href;

            const response: Response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to download ${src}`);

            const blob: Blob = await response.blob();
            const localPath: string = this.getCleanFileName(url);

            this.zip.file(localPath, blob);
            updatedHtml = updatedHtml.replace(src, localPath);

            processed++;
            onProgress(Math.round((processed / images.length) * 100));
          } catch (error) {
            console.error(`Error processing ${src}:`, error instanceof Error ? error.message : String(error));
          }
        })
      );

      this.zip.file("index.html", updatedHtml);
      const blob: Blob = await this.zip.generateAsync({ type: "blob" });

      const url: string = URL.createObjectURL(blob);
      const a: HTMLAnchorElement = document.createElement("a");
      a.href = url;
      a.download = portalId + ".zip";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Archive creation failed:", error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}
