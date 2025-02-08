export default function enumToString(e: any): string {
    return Object.keys(e)
        .filter(key => isNaN(Number(key))) // Filter out numeric keys (reverse mappings)
        .map(key => `${key}=${e[key]}`+"\n")
        .join(' \n');
}