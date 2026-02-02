// Manifestのfiles内 型指定
export type ManifestFileEnrty = {
    logicalId: string;
    relativePath: string;
    size: number;
    version: string;
}

// Manifestの本体 型指定
export type Manifest = {
    version: string;
    created?: string;
    updated?: string;
    generated_by?: string;
    count: number;
    files: Record<string, ManifestFileEnrty>
}