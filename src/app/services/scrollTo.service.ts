import { Injectable } from '@angular/core';
@Injectable()
export class ScrollFix {
  node;
  previousScroll: number;
  readyFor: string;
  toReset: boolean = false;
  constructor() {
  }
  init(node) {
    this.node = node;
  }
  scroll() {
    if (this.readyFor === 'up') {
      if (this.toReset && this.previousScroll !== undefined) {
        this.node.scrollTop = this.node.scrollHeight - this.previousScroll;
      }
      this.toReset = false;
    }
  }
}
