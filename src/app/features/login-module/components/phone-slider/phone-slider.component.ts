import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-phone-slider',
  templateUrl: './phone-slider.component.html',
  styleUrls: ['./phone-slider.component.scss'],
})
export class PhoneSliderComponent implements OnInit {
  private seconds = 3;
  private i = 1;
  private images = ['s1', 's2', 's3'];
  protected imageSrc: string = 's1';

  ngOnInit(): void {
    setInterval(() => {
      this.swapImages();
    }, this.seconds * 1000);
  }

  private swapImages(): void {
    this.imageSrc = this.images[this.i];
    if (this.i <= this.imageSrc.length - 1) {
      this.i++;
    } else {
      this.i = 0;
    }
  }
}
