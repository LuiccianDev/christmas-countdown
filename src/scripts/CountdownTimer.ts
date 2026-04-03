export class CountdownTimer {
  private countdownDiv: HTMLElement;
  private christmasDate: Date;
  private intervalId: number | null = null;
  private currentValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };
  private isShowingChristmasMessage = false;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container not found: ${containerId}`);
    this.countdownDiv = el;
    this.christmasDate = new Date(new Date().getFullYear(), 11, 25, 0, 0, 0, 0);
    this.createCountdownStructure();
  }

  private createCountdownStructure(): void {
    this.countdownDiv.innerHTML = `
      <div class="countdown-container">
        <div class="countdown-content">
          <div class="countdown-title">
                <div class="countdown-title-christmas" >Christmas </div>
                <div class="countdown-title-countdown">Countdown </div>           
          </div>
          <div class="countdown-wrapper">
            <div class="time-unit">
              <div class="flip-group">
                <span class="number" id="days-hundreds" data-number="0">
                  <span class="primary" title="0"></span>
                  <span class="secondary" title="0"></span>
                </span>
                <span class="number" id="days-tens" data-number="0">
                  <span class="primary" title="0"></span>
                  <span class="secondary" title="0"></span>
                </span>
                <span class="number" id="days-ones" data-number="0">
                  <span class="primary" title="0"></span>
                  <span class="secondary" title="0"></span>
                </span>
              </div>
              <div class="time-label">Days</div>
            </div>
            <div class="time-unit">
              <div class="flip-group">
                <span class="number" id="hours-tens" data-number="0">
                  <span class="primary" title="0"></span>
                  <span class="secondary" title="0"></span>
                </span>
                <span class="number" id="hours-ones" data-number="0">
                  <span class="primary" title="0"></span>
                  <span class="secondary" title="0"></span>
                </span>
              </div>
              <div class="time-label">Hours</div>
            </div>
            <div class="time-unit">
              <div class="flip-group">
                <span class="number" id="minutes-tens" data-number="0">
                  <span class="primary" title="0"></span>
                  <span class="secondary" title="0"></span>
                </span>
                <span class="number" id="minutes-ones" data-number="0">
                  <span class="primary" title="0"></span>
                  <span class="secondary" title="0"></span>
                </span>
              </div>
              <div class="time-label">Minutes</div>
            </div>
            <div class="time-unit">
              <div class="flip-group">
                <span class="number" id="seconds-tens" data-number="0">
                  <span class="primary" title="0"></span>
                  <span class="secondary" title="0"></span>
                </span>
                <span class="number" id="seconds-ones" data-number="0">
                  <span class="primary" title="0"></span>
                  <span class="secondary" title="0"></span>
                </span>
              </div>
              <div class="time-label">Seconds</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private calculateTimeLeft(): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isChristmasDay: boolean;
  } {
    const now = new Date();

    // Check if it's currently Christmas Day (Dec 25th)
    const isChristmasDay = now.getMonth() === 11 && now.getDate() === 25;

    // If Christmas has passed this year (Dec 26-31), set target to next year
    if (now.getTime() > this.christmasDate.getTime() && !isChristmasDay) {
      this.christmasDate = new Date(now.getFullYear() + 1, 11, 25, 0, 0, 0, 0);
    }

    const diff = this.christmasDate.getTime() - now.getTime();

    if (isChristmasDay) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isChristmasDay: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isChristmasDay: false,
    };
  }

  private updateFlipDigit(containerId: string, value: number): void {
    const element = document.getElementById(containerId);
    if (!element) return;

    const currentNumber = Number(element.getAttribute('data-number'));

    // If the value hasn't changed, do nothing
    if (currentNumber === value) return;

    // Update titles for the next number
    const primary = element.querySelector('.primary');
    const secondary = element.querySelector('.secondary');

    if (primary && secondary) {
      primary.setAttribute('title', value.toString());
      secondary.setAttribute('title', value.toString());
    }

    // Add flip class to start animation
    element.classList.add('flip');

    // After animation, update data-number and remove flip
    setTimeout(() => {
      element.setAttribute('data-number', value.toString());
      element.classList.remove('flip');
    }, 500);
  }

  private updateDigits(value: number, prefix: string, maxDigits: number): void {
    const digits = value.toString().padStart(maxDigits, '0').split('').map(Number);

    if (maxDigits === 3) {
      this.updateFlipDigit(`${prefix}-hundreds`, digits[0]);
      this.updateFlipDigit(`${prefix}-tens`, digits[1]);
      this.updateFlipDigit(`${prefix}-ones`, digits[2]);
    } else {
      this.updateFlipDigit(`${prefix}-tens`, digits[0]);
      this.updateFlipDigit(`${prefix}-ones`, digits[1]);
    }
  }

  private updateCountdown(): void {
    const { days, hours, minutes, seconds, isChristmasDay } = this.calculateTimeLeft();

    if (isChristmasDay) {
      if (!this.isShowingChristmasMessage) {
        this.countdownDiv.innerHTML = `
          <div class="countdown-container">
            <div class="countdown-content" style="text-align: center;">
              <div class="countdown-title">
                  <div class="countdown-title-christmas" style="color: #ff3b3b; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">Merry 🎄</div>
                  <div class="countdown-title-countdown" style="color: #4cd137; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">Christmas 🎅</div>           
              </div>
              <p style="color: white; font-size: clamp(1rem, 2vw, 1.5rem); margin-top: 25px;">Wishing you joy, peace, and happiness!</p>
            </div>
          </div>
        `;
        this.isShowingChristmasMessage = true;
      }
      return;
    }

    // If it was Christmas but now it's not (e.g. Dec 26th), revert the UI
    if (this.isShowingChristmasMessage) {
      this.createCountdownStructure();
      this.isShowingChristmasMessage = false;
      this.currentValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };
    }

    if (days !== this.currentValues.days) {
      this.updateDigits(days, 'days', 3);
      this.currentValues.days = days;
    }

    if (hours !== this.currentValues.hours) {
      this.updateDigits(hours, 'hours', 2);
      this.currentValues.hours = hours;
    }

    if (minutes !== this.currentValues.minutes) {
      this.updateDigits(minutes, 'minutes', 2);
      this.currentValues.minutes = minutes;
    }

    if (seconds !== this.currentValues.seconds) {
      this.updateDigits(seconds, 'seconds', 2);
      this.currentValues.seconds = seconds;
    }
  }

  public start(): void {
    this.updateCountdown();
    this.intervalId = window.setInterval(() => this.updateCountdown(), 1000);
  }

  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public getDaysLeft(): number {
    return this.calculateTimeLeft().days;
  }
}
