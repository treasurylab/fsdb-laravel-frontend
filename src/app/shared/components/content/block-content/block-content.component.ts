import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-block-content',
  templateUrl: './block-content.component.html',
  styleUrl: './block-content.component.scss',
})
export class BlockContentComponent {
  /**
   * Block Container that contains a @Title , @Body , and an option to navigate to a page via the @LearnMore using a router link.
   * Passing no @learnMoreRouterLink removes view more automatically.
   * Google Icon Support, send icon string in @icon , without it will show nothing.
   * TODO: Add option to switch icon dynamically.
   * */
  @Input({ required: true }) title = '';
  @Input({ required: true }) body = '';
  @Input() icon?: string;
  @Input() learnMoreRouterLink?: string;
}
