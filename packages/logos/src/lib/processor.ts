import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'path';
import { optimize } from 'svgo';
import sharp, { PngOptions, ResizeOptions, Color, Sharp } from 'sharp';
import { extractName, mkDirDist } from './dir';

export function isSvg(name: string): boolean {
  return name.endsWith('.svg');
}

export function square(size: number): ResizeOptions {
  return {
    width: size,
    height: size,
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0}
  }
}

export class ImageProcessor {
  private inputFile: string;
  private outDir: string;
  private nameNoExt: string;

  private svgContent: string = '';
  private buffer: Buffer;

  private pngOpt?: PngOptions;
  
  constructor (input: string, outDir: string) {
    this.inputFile = input;
    this.outDir = outDir;
    this.nameNoExt = extractName(input);
  }

  async loadSvg() {
    if (!isSvg(this.inputFile)) {
      return;
    }

    if (this.svgContent) {
      return this;
    }

    this.svgContent = await readFile(this.inputFile, { encoding: 'utf-8' });

    return this;
  }

  async fillBuffer() {
    if (this.svgContent) {
      if (!this.buffer) {
        this.buffer = Buffer.from(this.svgContent);
      }
      return;
    }

    this.buffer = await readFile(this.inputFile);
    return this;
  }

  async optmizeSvg() {
    await this.loadSvg();

    const outFile = resolve(this.outDir, `${this.nameNoExt}.svg`);
    const result = optimize(this.svgContent);

    await writeFile(outFile, result.data);

    console.log('Saved SVG: ', outFile);

    return this;
  }

  private sharp(): Sharp {
    return sharp(this.buffer);
  }

  withPng(opts: PngOptions) {
    this.pngOpt = opts;
    return this;
  }

  async toPng(resize?: ResizeOptions) {
    await this.fillBuffer();

    const b = await this.sharp()
      .png(this.pngOpt)
      .resize(resize)
      .toBuffer();

    let suffix: string = '';
    if (resize && resize.height && resize.width) {
      suffix = `-${resize.width}x${resize.height}`;
    }

    const outFile = resolve(this.outDir, `${this.nameNoExt}${suffix}.png`);

    await writeFile(outFile, b);

    console.log('Saved PNG: ', outFile);

    return this;
  }

  async toMultiPng(sizes: ResizeOptions[]) {
    return Promise.all(sizes.map(s => this.toPng(s)));
  }
}

if (require.main === module) {
  const main = async function () {
    const input = resolve(__dirname, '../../svg/brand-ftc-logo-square.svg');
    const outDir = await mkDirDist('test');

    const p = new ImageProcessor(input, outDir);

    await p.toPng();

    await p.toMultiPng([square(300)]);
  }
  
  main().catch(console.error);
}
