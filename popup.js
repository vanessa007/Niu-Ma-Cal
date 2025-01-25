let lottieAnimation = null;

async function fetchEncouragement() {
    try {
        const loadingContainer = document.getElementById('loadingContainer');
        loadingContainer.style.display = 'block';
        
        if (!lottieAnimation) {
            const lottiePath = chrome?.runtime?.getURL ? 
                chrome.runtime.getURL('loading.json') : 
                'loading.json';
            
            console.log('Loading Lottie from:', lottiePath);
            
            try {
                lottieAnimation = lottie.loadAnimation({
                    container: document.getElementById('lottieAnimation'),
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: lottiePath
                });

                lottieAnimation.addEventListener('data_ready', () => {
                    console.log('Lottie data loaded successfully');
                });
                
                lottieAnimation.addEventListener('error', (error) => {
                    console.error('Lottie loading error:', error);
                });
            } catch (lottieError) {
                console.error('Error creating Lottie animation:', lottieError);
            }
        }
    } catch (error) {
        console.error('Detailed error:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
  const calendar = document.getElementById('calendar');
  const currentDate = new Date();
  const currentYear = 2025;

  const chineseHolidays = [
    '2025-01-28', // Spring Festival
    '2025-01-29',
    '2025-01-30',
    '2025-01-31',
    '2025-02-01',
    '2025-02-02',
    '2025-02-03',
    '2025-02-04',
    '2025-04-04', // Qingming Festival
    '2025-04-05',
    '2025-04-06',
    '2025-05-01', // Labor Day
    '2025-05-02',
    '2025-05-03',
    '2025-05-04',
    '2025-05-05',
    '2025-05-31', // Dragon Boat Festival
    '2025-06-01',
    '2025-06-02',
    '2025-10-01', // National Day
    '2025-10-02',
    '2025-10-03',
    '2025-10-04',
    '2025-10-05',
    '2025-10-06',
    '2025-10-07',
    '2025-10-08'
  ];

  const specialWorkdays = [
    '2025-01-26',
    '2025-02-08',
    '2025-04-27',
    '2025-09-28',
    '2025-10-11'
  ];

  function createDots() {
    for (let month = 0; month < 12; month++) {
      const lastDay = new Date(currentYear, month + 1, 0);
      
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(currentYear, month, day);
        const dotContainer = document.createElement('div');
        dotContainer.className = 'dot-container';
        const img = document.createElement('img');
        img.className = 'dot';

        const formattedDate = `${currentYear}/${String(month + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
        dotContainer.setAttribute('data-date', formattedDate);

        const dateString = `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        if (date.setHours(0,0,0,0) === currentDate.setHours(0,0,0,0)) {
          img.src = 'icons/today.svg';
        } else if (date < currentDate) {
          img.src = 'icons/past.svg';
        } else if (chineseHolidays.includes(dateString)) {
          img.src = 'icons/holiday.svg';
        } else if ((date.getDay() === 0 || date.getDay() === 6) && !specialWorkdays.includes(dateString)) {
          img.src = 'icons/weekend.svg';
        } else {
          img.src = 'icons/default.svg';
        }

        dotContainer.appendChild(img);
        calendar.appendChild(dotContainer);
      }
    }
  }

  function getNextWeekend() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = new Date(today);
    let daysToWeekend = 0;

    while (true) {
      checkDate.setDate(checkDate.getDate() + 1);
      daysToWeekend++;

      const dateString = `${currentYear}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      
      if (chineseHolidays.includes(dateString)) {
        continue;
      }

      if ((checkDate.getDay() === 0 || checkDate.getDay() === 6) && !specialWorkdays.includes(dateString)) {
        return daysToWeekend;
      }
    }
  }

  function getNextHoliday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const holidayDates = chineseHolidays
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => a - b);
    
    const nextHoliday = holidayDates.find(date => {
      date.setHours(0, 0, 0, 0);
      return date > today;
    });
    
    if (!nextHoliday) return null;
    
    let checkDate = new Date(today);
    let daysToHoliday = 0;
    
    while (checkDate < nextHoliday) {
      checkDate.setDate(checkDate.getDate() + 1);
      daysToHoliday++;
    }
    
    return { days: daysToHoliday, date: nextHoliday };
  }

  function updateTimeInfo() {
    const timeInfo = document.getElementById('timeInfo');
    const daysToWeekend = getNextWeekend();
    const nextHoliday = getNextHoliday();
    
    let infoText = `距离下一个周末还有 <strong>${daysToWeekend}</strong> 天`;
    if (nextHoliday) {
      infoText += ` · 距离下一个假期还有 <strong>${nextHoliday.days}</strong> 天`;
    }
    timeInfo.innerHTML = infoText;
  }

  createDots();
  updateTimeInfo();
  fetchEncouragement();
}); 