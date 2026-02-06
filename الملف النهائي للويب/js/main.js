// تهيئة الصفحة عند التحميل
$(document).ready(function() {
    // تهيئة المكونات
    renderSpaces();
    renderPricingTable();
    initDate();
    setupEventListeners();
    
    // إعدادات أولية
    $('.notification').hide();
    
    console.log('Gaza Workspaces - تم التحميل بنجاح');
});

// إعداد المستمعين للأحداث
function setupEventListeners() {
    // زر القائمة المتنقلة
    $('#mobileToggle').click(function() {
        $('#mobileNav').animate({ right: '0' }, 300);
        $('#overlay').fadeIn(300);
    });
    
    // إغلاق القائمة المتنقلة
    $('#closeMobileNav, #overlay').click(function() {
        $('#mobileNav').animate({ right: '-100%' }, 300);
        $('#overlay').fadeOut(300);
    });
    
    // فلترة المساحات
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        const filter = $(this).data('filter');
        filterSpaces(filter);
    });
    
    // البحث الفوري
    $('#searchInput').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterBySearch(searchTerm);
    });
    
    // زر البحث
    $('#searchBtn').click(function() {
        const searchTerm = $('#searchInput').val().toLowerCase();
        filterBySearch(searchTerm);
    });
    
    // إرسال نموذج الحجز
    $('#bookingForm').submit(function(e) {
        e.preventDefault();
        processBooking();
    });
    
    // إغلاق التنبيه
    $('#notificationClose').click(function() {
        hideNotification();
    });
    
    // الاشتراك في النشرة
    $('#subscribeBtn').click(function() {
        subscribeNewsletter();
    });
    
    // زر استكشاف المساحات
    $('#exploreSpacesBtn').click(function() {
        scrollToSection('spaces');
    });
    
    // زر احجز الآن
    $('#bookNowBtn').click(function() {
        scrollToSection('booking-form');
    });
    
    // أزرار التسجيل
    $('#registerBtn, #mobileRegisterBtn').click(function() {
        showNotification('سيتم تفعيل نظام التسجيل قريباً! حالياً يمكنك الحجز مباشرة.', 'info');
    });
    
    $('#loginBtn, #mobileLoginBtn').click(function() {
        showNotification('سيتم تفعيل نظام التسجيل والدخول قريباً!', 'info');
    });
    
    // تمرير سلس عند النقر على الروابط
    $('a[href^="#"]').click(function(e) {
        if ($(this).attr('href') !== '#') {
            e.preventDefault();
            const target = $($(this).attr('href'));
            if (target.length) {
                scrollToSection(target.attr('id'));
            }
        }
    });
    
    // تأثير الهيدر عند التمرير
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#header').addClass('header-scrolled');
        } else {
            $('#header').removeClass('header-scrolled');
        }
        
        // تأثير الظهور عند التمرير
        $('.space-card, .feature-card').each(function() {
            if (isElementInViewport($(this))) {
                $(this).addClass('animate__animated animate__fadeInUp');
            }
        });
    });
    
    // تأثير Hover على البطاقات
    $(document).on('mouseenter', '.space-card', function() {
        $(this).css({
            'transform': 'translateY(-15px)',
            'box-shadow': 'var(--shadow-hover)'
        }).find('.space-img img').css('transform', 'scale(1.05)');
    }).on('mouseleave', '.space-card', function() {
        $(this).css({
            'transform': 'translateY(0)',
            'box-shadow': 'var(--shadow)'
        }).find('.space-img img').css('transform', 'scale(1)');
    });
}

// التحكم بالفيديو
function setupVideoControls() {
    const video = $('#workspaceVideo')[0];
    const playPauseBtn = $('#playPauseBtn');
    const muteBtn = $('#muteBtn');
    const currentTimeEl = $('#currentTime');
    const durationEl = $('#duration');
    
    // التحقق من وجود الفيديو
    if (!video) {
        console.log('الفيديو غير موجود');
        return;
    }
    
    // حدث تحميل الفيديو
    video.addEventListener('loadedmetadata', function() {
        durationEl.text(formatTime(video.duration));
    });
    
    // تحديث الوقت
    video.addEventListener('timeupdate', function() {
        currentTimeEl.text(formatTime(video.currentTime));
    });
    
    // زر التشغيل/الإيقاف
    playPauseBtn.click(function() {
        if (video.paused) {
            video.play();
            playPauseBtn.html('<i class="fas fa-pause"></i> إيقاف');
            playPauseBtn.removeClass('btn-primary').addClass('btn-danger');
        } else {
            video.pause();
            playPauseBtn.html('<i class="fas fa-play"></i> تشغيل');
            playPauseBtn.removeClass('btn-danger').addClass('btn-primary');
        }
    });
    
    // زر كتم الصوت
    muteBtn.click(function() {
        if (video.muted) {
            video.muted = false;
            muteBtn.html('<i class="fas fa-volume-up"></i> صوت');
            muteBtn.removeClass('btn-danger').addClass('btn-outline');
        } else {
            video.muted = true;
            muteBtn.html('<i class="fas fa-volume-mute"></i> كتم');
            muteBtn.removeClass('btn-outline').addClass('btn-danger');
        }
    });
    
    // حدث اكتمال الفيديو
    video.addEventListener('ended', function() {
        playPauseBtn.html('<i class="fas fa-play"></i> تشغيل');
        playPauseBtn.removeClass('btn-danger').addClass('btn-primary');
        showNotification('تم انتهاء الفيديو! هل تريد مشاهدة مرة أخرى؟', 'info');
    });
    
    // حدث خطأ في الفيديو
    video.addEventListener('error', function() {
        console.log('خطأ في تحميل الفيديو');
        showNotification('عذراً، حدث خطأ في تحميل الفيديو. يرجى التحقق من الملف.', 'error');
        
        // إضافة بديل للفيديو
        const fallbackHTML = `
            <div class="video-fallback">
                <i class="fas fa-video-slash"></i>
                <h3>الفيديو غير متوفر حالياً</h3>
                <p>نحن نعمل على إصلاح المشكلة. يمكنك استعراض الصور للتعرف على مساحاتنا.</p>
                <button class="btn btn-primary mt-3" id="viewSpacesBtn">
                    <i class="fas fa-images"></i> استعرض الصور
                </button>
            </div>
        `;
        
        $('.video-wrapper').append(fallbackHTML);
        
        $('#viewSpacesBtn').click(function() {
            scrollToSection('spaces');
        });
    });
    
    // تشغيل الفيديو تلقائياً عند ظهوره في الشاشة
    $(window).scroll(function() {
        if (isElementInViewport($('.video-wrapper'))) {
            if (video.paused && !video.ended) {
                // يمكنك إلغاء التعليق هنا لتشغيل الفيديو تلقائياً
                // video.play();
                // playPauseBtn.html('<i class="fas fa-pause"></i> إيقاف');
                // playPauseBtn.removeClass('btn-primary').addClass('btn-danger');
            }
        }
    });
    
    // النقر على الفيديو للتحكم
    video.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            playPauseBtn.html('<i class="fas fa-pause"></i> إيقاف');
            playPauseBtn.removeClass('btn-primary').addClass('btn-danger');
        } else {
            video.pause();
            playPauseBtn.html('<i class="fas fa-play"></i> تشغيل');
            playPauseBtn.removeClass('btn-danger').addClass('btn-primary');
        }
    });
}

// تنسيق الوقت
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// تحديث تهيئة الصفحة لتحتوي على الفيديو
$(document).ready(function() {
    // تهيئة المكونات
    renderSpaces();
    renderPricingTable();
    initDate();
    setupEventListeners();
    setupVideoControls(); // إضافة هذا السطر
    
    // إعدادات أولية
    $('.notification').hide();
    
    console.log('Gaza Workspaces - تم التحميل بنجاح');
});

// عرض المساحات
function renderSpaces() {
    const container = $('#spacesContainer');
    container.empty();
    
    workspaces.forEach(space => {
        const spaceCard = createSpaceCard(space);
        container.append(spaceCard);
    });
    
    updateBookingOptions();
}

// إنشاء بطاقة مساحة
function createSpaceCard(space) {
    return $(`
        <div class="space-card" data-id="${space.id}" data-status="${space.status}" data-area="${space.area}">
            <div class="space-img">
                <img src="${space.image}" alt="${space.name}">
                <div class="space-status ${space.status === 'available' ? 'status-available' : 'status-occupied'}">
                    ${space.status === 'available' ? 'متاحة الآن' : 'ممتلئة'}
                </div>
                <div class="space-location">
                    <i class="fas fa-map-marker-alt"></i> ${space.location}
                </div>
            </div>
            <div class="space-content">
                <h3 class="space-title">${space.name}</h3>
                <p class="space-desc">${space.description}</p>
                
                <div class="space-features">
                    <div class="feature">
                        <i class="fas fa-users feature-icon"></i>
                        <span class="feature-text">${space.capacity} شخص</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-wifi feature-icon"></i>
                        <span class="feature-text">واي فاي</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-coffee feature-icon"></i>
                        <span class="feature-text">مشروبات</span>
                    </div>
                </div>
                
                <div class="space-price">
                    <div class="price">${space.price} <span>${appConfig.currency}/ساعة</span></div>
                    <button class="btn ${space.status === 'available' ? 'btn-primary' : 'btn-outline'} book-space-btn" 
                        data-id="${space.id}"
                        ${space.status === 'occupied' ? 'disabled' : ''}>
                        <i class="fas fa-calendar-plus"></i> ${space.status === 'available' ? 'احجز الآن' : 'ممتلئة'}
                    </button>
                </div>
            </div>
        </div>
    `).on('click', '.book-space-btn', function() {
        if (!$(this).prop('disabled')) {
            const spaceId = $(this).data('id');
            bookSpace(spaceId);
        }
    });
}

// فلترة المساحات
function filterSpaces(filter) {
    $('.space-card').fadeOut(300, function() {
        if (filter === 'all') {
            $('.space-card').fadeIn(500);
        } else {
            $(`.space-card[data-status="${filter}"], .space-card[data-area="${filter}"]`).fadeIn(500);
        }
    });
}

// البحث الفوري
function filterBySearch(term) {
    $('.space-card').each(function() {
        const $card = $(this);
        const title = $card.find('.space-title').text().toLowerCase();
        const desc = $card.find('.space-desc').text().toLowerCase();
        const location = $card.find('.space-location').text().toLowerCase();
        
        if (title.includes(term) || desc.includes(term) || location.includes(term)) {
            $card.fadeIn(300);
        } else {
            $card.fadeOut(300);
        }
    });
}

// حجز مساحة
function bookSpace(spaceId) {
    const space = workspaces.find(s => s.id == spaceId);
    if (!space || space.status === 'occupied') return;
    
    scrollToSection('booking-form');
    
    // تحديث خيار الحجز
    $('#bookingSpace').val(spaceId);
    
    showNotification(`مساحة "${space.name}" جاهزة للحجز! اختر التاريخ والوقت المناسبين`, 'info');
}

// عرض جدول الأسعار
function renderPricingTable() {
    const tableBody = $('#pricingTableBody');
    tableBody.empty();
    
    pricingPlans.forEach(plan => {
        const row = $(`
            <tr ${plan.popular ? 'class="table-warning"' : ''}>
                <td>
                    ${plan.name}
                    ${plan.popular ? '<span class="badge bg-primary">الأكثر طلباً</span>' : ''}
                </td>
                <td>${plan.duration}</td>
                <td><del>${plan.normalPrice}</del></td>
                <td><strong>${plan.specialPrice}</strong></td>
                <td><span class="text-success">${plan.savings}</span></td>
                <td>${plan.features}</td>
                <td>
                    <button class="btn btn-sm btn-primary book-plan-btn" data-id="${plan.id}">
                        احجز الآن
                    </button>
                </td>
            </tr>
        `).on('click', '.book-plan-btn', function() {
            const planId = $(this).data('id');
            bookPlan(planId);
        });
        
        tableBody.append(row);
    });
}

// حجز باقة
function bookPlan(planId) {
    const plan = pricingPlans.find(p => p.id == planId);
    if (!plan) return;
    
    scrollToSection('booking-form');
    showNotification(`باقة "${plan.name}" متاحة للحجز! املأ النموذج للاستفادة من العرض.`, 'info');
}

// معالجة الحجز
function processBooking() {
    const spaceId = $('#bookingSpace').val();
    const date = $('#bookingDate').val();
    const time = $('#bookingTime').val();
    const duration = $('#bookingDuration').val();
    const purpose = $('#bookingPurpose').val();
    const paymentMethod = $('input[name="payment"]:checked').val();
    
    // التحقق من الحقول
    if (!spaceId || !date || !time || !purpose) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    const space = workspaces.find(s => s.id == spaceId);
    if (!space) {
        showNotification('المساحة المختارة غير موجودة', 'error');
        return;
    }
    
    // محاكاة عملية الحجز
    showNotification('جاري معالجة حجزك...', 'info');
    
    setTimeout(() => {
        // إنشاء حجز جديد
        const reservation = {
            id: Date.now(),
            spaceId: space.id,
            spaceName: space.name,
            date: date,
            time: time,
            duration: duration,
            purpose: purpose,
            paymentMethod: paymentMethod,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        // إضافة الحجز
        currentReservations.push(reservation);
        
        // إظهار تأكيد
        showNotification(`تم تأكيد حجزك في "${space.name}" بنجاح! سيصلك إشعار قبل الموعد بـ${appConfig.notificationTime} ساعة.`);
        
        // إعادة تعيين النموذج
        $('#bookingForm')[0].reset();
        initDate();
        
        // محاكاة إرسال الإشعارات
        simulateNotifications(reservation);
        
    }, 1500);
}

// محاكاة الإشعارات
function simulateNotifications(reservation) {
    console.log('✅ تم إرسال إشعارات الحجز:');
    console.log(`   - إشعار تأكيد إلى: ${reservation.spaceName}`);
    console.log(`   - إشعار تذكير سيصلك قبل ${appConfig.notificationTime} ساعة`);
    console.log(`   - رقم الحجز: ${reservation.id}`);
}

// تحديث خيارات الحجز
function updateBookingOptions() {
    const select = $('#bookingSpace');
    select.empty().append('<option value="">-- اختر مساحة العمل --</option>');
    
    workspaces.forEach(space => {
        if (space.status === 'available') {
            select.append(new Option(`${space.name} - ${space.location} (${space.price} ${appConfig.currency}/ساعة)`, space.id));
        }
    });
}

// تهيئة التاريخ
function initDate() {
    const today = new Date().toISOString().split('T')[0];
    $('#bookingDate').val(today).attr('min', today);
    
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + appConfig.maxBookingDays);
    $('#bookingDate').attr('max', maxDate.toISOString().split('T')[0]);
}

// الاشتراك في النشرة
function subscribeNewsletter() {
    const email = $('#newsletterEmail').val().trim();
    
    if (!email) {
        showNotification('يرجى إدخال بريدك الإلكتروني', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
        return;
    }
    
    showNotification('شكراً لاشتراكك في نشرتنا! ستتلقى آخر العروض على بريدك.', 'success');
    $('#newsletterEmail').val('');
}

// التحقق من البريد الإلكتروني
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


// التمرير السلس
function scrollToSection(sectionId) {
    const section = $('#' + sectionId);
    if (section.length) {
        $('html, body').animate({
            scrollTop: section.offset().top - 100
        }, 800);
        
        // إغلاق القائمة المتنقلة
        $('#mobileNav').animate({ right: '-100%' }, 300);
        $('#overlay').fadeOut(300);
    }
}

// إظهار التنبيه
function showNotification(message, type = 'success') {
    const notification = $('#notification');
    const icon = notification.find('.notification-icon');
    const text = notification.find('.notification-text');
    
    // تعيين الأيقونة والنص حسب النوع
    switch(type) {
        case 'error':
            icon.html('<i class="fas fa-exclamation-circle"></i>').css('color', 'var(--danger)');
            text.html('<h4>حدث خطأ!</h4><p>' + message + '</p>');
            break;
        case 'info':
            icon.html('<i class="fas fa-info-circle"></i>').css('color', 'var(--accent)');
            text.html('<h4>معلومة</h4><p>' + message + '</p>');
            break;
        default:
            icon.html('<i class="fas fa-check-circle"></i>').css('color', 'var(--success)');
            text.html('<h4>تمت العملية بنجاح!</h4><p>' + message + '</p>');
    }
    
    // إظهار التنبيه مع تأثير jQuery
    notification.fadeIn(300).addClass('show');
    
    // إخفاء التنبيه بعد 5 ثوان
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

// إخفاء التنبيه
function hideNotification() {
    $('#notification').fadeOut(300).removeClass('show');
}

// التحقق إذا كان العنصر في النافذة
function isElementInViewport($el) {
    const rect = $el[0].getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// تهيئة الرسائل عند التحميل
$(window).on('load', function() {
    console.log(`🚀 ${appConfig.siteName} جاهز للاستخدام!`);
    console.log(`📞 للتواصل: ${appConfig.contact.phone}`);
});