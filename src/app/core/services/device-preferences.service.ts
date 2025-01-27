import {
  afterNextRender,
  computed,
  effect,
  ElementRef,
  HostListener,
  Injectable,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { configurationVariables } from '../configurationVariables';

@Injectable({
  providedIn: 'root',
})
export class DevicePreferencesService implements OnInit {
  constructor() {
    afterNextRender({
      read: () => {
        this.screenWidth.set(window.innerWidth);
        this.screenHeight.set(window.innerHeight);
      },
    });
  }

  screenWidth = signal<number | undefined>(undefined);
  screenHeight = signal<number | undefined>(undefined);

  private checkIsMobile(screenWidth: number | undefined): boolean {
    if (
      screenWidth &&
      screenWidth < configurationVariables.mobileScreenBreakpoint
    ) {
      return true;
    }
    return false;
  }

  isMobile: Signal<boolean> = computed(() =>
    this.checkIsMobile(this.screenWidth())
  );
  ngOnInit() {
    this.screenWidth.set(window.innerWidth);
    this.screenHeight.set(window.innerHeight);
  }
}
