import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fabric } from 'fabric';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  //private canvas!: fabric.Canvas;
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  canvas!: fabric.Canvas;

  private undoStack: any[] = [];
  private redoStack: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  onDragEnd(event: CdkDragEnd): void {
    const { x, y } = event.dropPoint;
    const rect = new fabric.Rect({
      left: x,
      top: y,
      fill: 'red',
      width: 50,
      height: 50
    });
    this.canvas.add(rect);
  }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement);
    this.canvas.setHeight(700);
    this.canvas.setWidth(900);

    this.canvas.on('object:added', () => this.saveState());
    this.canvas.on('object:modified', () => this.saveState());
    this.canvas.on('object:removed', () => this.saveState());
  }

  addText(): void {
    const text = new fabric.IText('Edit Text', {
      left: 50,
      top: 50,
      fontFamily: 'Arial',
      fill: '#333',
      fontSize: 20
    });

    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
  }

  // canvas.component.ts (add these methods)
  changeFont(event: any): void {
    const activeObject = this.canvas.getActiveObject() as fabric.IText;
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.fontFamily = event.target.value;
      this.canvas.renderAll();
    }
  }

  changeFontSize(event: any): void {
    const activeObject = this.canvas.getActiveObject() as fabric.IText;
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.fontSize = event.target.value;
      this.canvas.renderAll();
    }
  }

  toggleBold(): void {
    const activeObject = this.canvas.getActiveObject() as fabric.IText;
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.fontWeight = activeObject.fontWeight === 'bold' ? 'normal' : 'bold';
      this.canvas.renderAll();
    }
  }

  toggleItalic(): void {
    const activeObject = this.canvas.getActiveObject() as fabric.IText;
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.fontStyle = activeObject.fontStyle === 'italic' ? 'normal' : 'italic';
      this.canvas.renderAll();
    }
  }

  toggleUnderline(): void {
    const activeObject = this.canvas.getActiveObject() as fabric.IText;
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.underline = !activeObject.underline;
      this.canvas.renderAll();
    }
  }

  changeTextColor(event: any): void {
    const activeObject = this.canvas.getActiveObject() as fabric.IText;
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.set('fill', event.target.value);
      this.canvas.renderAll();
    }
  }

  changeBackgroundColor(event: any): void {
    const activeObject = this.canvas.getActiveObject() as fabric.IText;
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.set('backgroundColor', event.target.value);
      this.canvas.renderAll();
    }
  }

  setTextAlign(alignment: 'left' | 'center' | 'right' | 'justify'): void {
    const activeObject = this.canvas.getActiveObject() as fabric.IText;
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.set('textAlign', alignment);
      this.canvas.renderAll();
    }
  }

  saveState(): void {
    const json = this.canvas.toJSON();
    this.undoStack.push(JSON.stringify(json));
    this.redoStack = []; // Clear redo stack
  }

  undo(): void {
    //if (this.undoStack.length > 1) {
    const currentState = this.undoStack.pop();
    this.redoStack.push(currentState);
    const previousState = this.undoStack[this.undoStack.length - 1];
    this.canvas.loadFromJSON(previousState, () => {
      this.canvas.renderAll();
    });
    // }
  }

  redo(): void {
    //if (this.redoStack.length > 0) {
    const state = this.redoStack.pop();
    this.undoStack.push(state);
    this.canvas.loadFromJSON(state, () => {
      this.canvas.renderAll();
    });
    //}
  }

  saveCanvas() {
    const objects = this.canvas.getObjects();
    let htmlContent = '<div class="canvas-container" style="position: relative; width: 900px; height: 700px;">\n';
    let cssContent = '';

    objects.forEach((obj, index) => {
      if (obj.type === 'i-text') {
        htmlContent += this.convertTextToHtml(obj as fabric.IText, index);
        cssContent += this.convertTextToCss(obj as fabric.IText, index);
      } else if (obj.type === 'image') {
        htmlContent += this.convertImageToHtml(obj as fabric.Image, index);
        cssContent += this.convertImageToCss(obj as fabric.Image, index);
      }
    });

    htmlContent += '</div>';
    this.downloadHtml(htmlContent, cssContent);
  }

  convertTextToHtml(text: fabric.IText, index: number): string {
    const textAlignStyle = this.getTextAlignStyle(text);
    const nameAttribute = text.name ? `name="${text.name}"` : '';
    return `<span class="canvas-text-${index}" ${nameAttribute} style="position: absolute; left: ${text.left}px; top: ${text.top}px; ${textAlignStyle}">${text.text}</span>\n`;
  }

  convertTextToCss(text: fabric.IText, index: number): string {
    let width
    if (text.name === 'Address') {
      width = 300
    } else if (text.name === 'Signature') {
      width = 200
    } else if (text.name === 'Name') {
      width = 200
    } else {
      width = text.width
    }
    return `.canvas-text-${index} {
    font-family: ${text.fontFamily};
    font-size: ${text.fontSize}px;
    color: ${text.fill};
    font-weight: ${text.fontWeight};
    font-style: ${text.fontStyle};
    text-decoration: ${text.underline ? 'underline' : 'none'};
    width: ${width}px;
  }\n`;
  }

  getTextAlignStyle(text: fabric.IText): string {
    switch (text.textAlign) {
      case 'center':
        return 'text-align: center; transform: translateX(-50%);';
      case 'right':
        return 'text-align: right;';
      case 'justify':
        return 'text-align: justify;';
      default:
        return 'text-align: left;';
    }
  }

  convertImageToHtml(image: fabric.Image, index: number): string {
    const dataUrl = image.toDataURL({});
    return `<img src="${dataUrl}" class="canvas-image-${index}" style="position: absolute; left: ${image.left}px; top: ${image.top}px;" />\n`;
  }

  convertImageToCss(image: fabric.Image, index: number): string {
    const width = (image.width ?? 0) * (image.scaleX ?? 1);
    const height = (image.height ?? 0) * (image.scaleY ?? 1);

    return `.canvas-image-${index} {
    width: ${width}px;
    height: ${height}px;
  }\n`;
  }

  addFields(textValue: string): void {
    const text = new fabric.IText(textValue, {
      left: 50,
      top: 50,
      fontFamily: 'Arial',
      fill: '#333',
      fontSize: 20,
      width: 200,
      name: textValue
    });

    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        fabric.Image.fromURL(e.target.result, (img) => {
          img.set({
            left: 50,
            top: 50,
            scaleX: 0.5,
            scaleY: 0.5
          });
          this.canvas.add(img);
          this.canvas.renderAll();
        });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // async savePdf() {
  //   const canvasElement = this.canvasElement.nativeElement;
  //   if (!canvasElement) {
  //     throw new Error('Canvas element not found');
  //   }
  //   const canvasImage = await html2canvas(canvasElement);
  //   this.downloadPdf(canvasImage);
  // }

  // downloadPdf(canvasImage: HTMLCanvasElement): void {
  //   const pdf = new jsPDF('p', 'pt', 'a4');
  //   const imgData = canvasImage.toDataURL('image/png');
  //   const imgProps = pdf.getImageProperties(imgData);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //   pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //   pdf.save('demo.pdf');
  // }

  // downloadHtml(htmlContent: string, cssContent: string): void {
  //   const blob = new Blob([`
  //   <!DOCTYPE html>
  //   <html lang="en">
  //   <head>
  //     <meta charset="UTF-8">
  //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //     <style>
  //       ${cssContent}
  //     </style>
  //   </head>
  //   <body>
  //     ${htmlContent}
  //   </body>
  //   </html>
  // `], { type: 'text/html' });

  //   const a = document.createElement('a');
  //   a.href = URL.createObjectURL(blob);
  //   a.download = 'demo.html';
  //   a.click();
  //   URL.revokeObjectURL(a.href);
  // }


  downloadHtml(htmlContent: string, cssContent: string): void {
    const htmlString = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        ${cssContent}
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

    const blob = new Blob([htmlString], { type: 'text/html' });

    // Create a temporary link element for the HTML download
    const aHtml = document.createElement('a');
    aHtml.href = URL.createObjectURL(blob);
    aHtml.download = 'demo.html';
    aHtml.click();
    URL.revokeObjectURL(aHtml.href);

    // Create a temporary iframe to hold the HTML content for PDF conversion
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.srcdoc = htmlString;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      const iframeBody = iframe.contentDocument?.body as HTMLElement;
      if (iframeBody) {
        html2canvas(iframeBody).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'pt', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('demo.pdf');

          // Clean up the temporary iframe
          document.body.removeChild(iframe);
        }).catch(error => {
          console.error('Error generating PDF: ', error);
        });
      } else {
        console.error('iframe body not found!');
      }
    };
  }

}