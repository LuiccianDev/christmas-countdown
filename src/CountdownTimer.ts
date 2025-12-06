export class CountdownTimer {
  private countdownDiv: HTMLElement;
  private christmasDate: Date;
  private notifyDays: number;
  private intervalId: number | null = null;
  private notifiedDays: Set<number> = new Set();
  private currentValues = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  constructor(containerId: string, notifyDays: number = 7) {
    this.countdownDiv = document.getElementById(containerId)!;
    this.christmasDate = new Date(new Date().getFullYear(), 11, 25, 0, 0, 0, 0);
    this.notifyDays = notifyDays;
    this.requestNotificationPermission();
    this.createCountdownStructure();
  }

  private createCountdownStructure(): void {
    this.countdownDiv.innerHTML = `
      <div class="countdown-container">
        <h1 class="countdown-title">CHRISTMAS COUNTDOWN</h1>
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
    `;
  }

  private requestNotificationPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  private calculateTimeLeft(): { days: number; hours: number; minutes: number; seconds: number } {
    const now = new Date();
    const diff = this.christmasDate.getTime() - now.getTime();
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  }

  private updateFlipDigit(containerId: string, value: number): void {
    const element = document.getElementById(containerId);
    if (!element) return;

    const currentNumber = Number(element.getAttribute('data-number'));
    
    // Si el valor no ha cambiado, no hacer nada
    if (currentNumber === value) return;

    // Actualizar los títulos para el siguiente número
    const primary = element.querySelector('.primary');
    const secondary = element.querySelector('.secondary');
    
    if (primary && secondary) {
      primary.setAttribute('title', value.toString());
      secondary.setAttribute('title', value.toString());
    }

    // Agregar clase flip para iniciar animación
    element.classList.add('flip');

    // Después de la animación, actualizar el data-number y remover flip
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
    const { days, hours, minutes, seconds } = this.calculateTimeLeft();
    
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

    if (days <= this.notifyDays && days >= 0 && !this.notifiedDays.has(days)) {
      this.sendNotification(days);
      this.notifiedDays.add(days);
    }
  }

  private sendNotification(days: number): void {
    if (Notification.permission === 'granted') {
      new Notification(`¡Solo faltan ${days} días para Navidad!`, {
        icon: '🎄',
        body: '¡La Navidad se acerca!'
      });
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
