export interface TemplatePreviewResult {
  templateName: string;
  previewPath: string;
  success: boolean;
  error?: string;
}

export interface ITemplatePreviewGenerator {
  generatePreviewFromEdgeCode(
    edgeCode: string,
    outputName: string,
    customColors?: Record<string, string>
  ): Promise<TemplatePreviewResult>;
  closeBrowser(): Promise<void>;
}
