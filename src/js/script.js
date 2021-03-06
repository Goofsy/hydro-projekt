import 'core-js';
import 'regenerator-runtime/runtime';

class Slider {
  _slides = document.querySelectorAll('.slider__slide');
  _btnPrev = document.querySelector('.slider__btn--prev');
  _btnNext = document.querySelector('.slider__btn--next');
  _dotsContainer = document.querySelector('.slider__dots');

  _curSlide = 0;
  _maxSlide = this._slides.length;

  constructor() {
    this._createDots();
    this._goToSlide();
    this._activeDot();

    this._dotsHandler();
    this._btnPrevHandler();
    this._btnNextHandler();
    this._arrowsHandler();
  }

  _createDots() {
    [...this._slides].forEach((_, i) => {
      this._dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="slider__dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  _goToSlide(curSlide = 0) {
    [...this._slides].forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - curSlide)}%)`;
    });
  }

  _prevSlide() {
    if (this._curSlide === 0) this._curSlide = this._maxSlide - 1;
    else {
      this._curSlide--;
    }

    this._goToSlide(this._curSlide);
    this._activeDot(this._curSlide);
  }

  _nextSlide() {
    if (this._curSlide === this._maxSlide - 1) this._curSlide = 0;
    else {
      this._curSlide++;
    }

    this._goToSlide(this._curSlide);
    this._activeDot(this._curSlide);
  }

  _activeDot(curSlide = 0) {
    const [...dots] = document.querySelectorAll('.slider__dots__dot');
    dots.forEach(dot => dot.classList.remove('slider__dots__dot--active'));

    const dot = this._dotsContainer.querySelector(`[data-slide='${curSlide}']`);
    dot.classList.add('slider__dots__dot--active');
  }

  _dotsHandler() {
    this._dotsContainer.addEventListener('click', this._handleDots.bind(this));
  }

  _handleDots(e) {
    if (!e.target.classList.contains('slider__dots__dot')) return;
    const { slide } = e.target.dataset;
    this._goToSlide(slide);
    this._activeDot(slide);
  }

  _btnPrevHandler() {
    this._btnPrev.addEventListener('click', this._prevSlide.bind(this));
  }

  _btnNextHandler() {
    this._btnNext.addEventListener('click', this._nextSlide.bind(this));
  }

  _arrowsHandler() {
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'Left') this._prevSlide();
      if (e.key === 'ArrowRight' || e.key === 'Right') this._nextSlide();
    });
  }
}
new Slider();

// Smooth scrolling jQuery
$('.header a').on('click', function (e) {
  if (this.hash !== '') {
    e.preventDefault();

    const hash = this.hash;
    $('html, body').animate(
      {
        scrollTop: $(hash).offset().top,
      },
      800
    );
  }
});

// Send Email
class SendEmail {
  _form = document.querySelector('.form');
  _formInfo = document.querySelector('.form__info');
  _formSpinner = document.querySelector('.form__spinner');
  _inputName = document.querySelector('#name');
  _inputEmail = document.querySelector('#email');
  _inputPhone = document.querySelector('#phone');
  _inputMessage = document.querySelector('#message');

  constructor() {
    this._handlerForm();
    this._addFilledClass();
    this._removeErrorClassHandler();
  }

  _handlerForm() {
    this._form.addEventListener('submit', this._handleForm.bind(this));
  }

  async _handleForm(e) {
    e.preventDefault();
    try {
      const _inputNameValue = this._inputName.value;
      const _inputEmailValue = this._inputEmail.value;
      const _inputPhoneValue = this._inputPhone.value;
      const _inputMessageValue = this._inputMessage.value;

      if (
        _inputNameValue.trim().length < 3 ||
        _inputNameValue === null ||
        _inputNameValue === ''
      ) {
        this._inputName.classList.add('form__group__input--error');
        throw new Error('Imię musi zawierać przynajmniej 3 znaki!');
      }

      if (!this._validateEmailAddress(_inputEmailValue)) {
        this._inputEmail.classList.add('form__group__input--error');
        throw new Error('Niepoprawny adres e-mail!');
      }

      if (
        _inputPhoneValue.trim().length < 8 ||
        _inputPhoneValue === null ||
        _inputPhoneValue === ''
      ) {
        this._inputPhone.classList.add('form__group__input--error');
        throw new Error('Nr telefonu musi zawierać przynajmniej 8 znaków!');
      }

      if (
        _inputMessageValue.trim().length < 1 ||
        _inputMessageValue === null ||
        _inputMessageValue === ''
      ) {
        this._inputMessage.classList.add('form__group__input--error');
        throw new Error('Napisz coś :)');
      }

      this._formSpinner.style.display = 'inline-block';

      const send = await this._sendEmail(
        _inputNameValue,
        _inputEmailValue,
        _inputPhoneValue,
        _inputMessageValue
      );
      this._formSpinner.style.display = 'none';

      if (send !== 'OK') throw new Error('Coś poszło nie tak.');
      this._resetForm();
    } catch (err) {
      this._formInfo.innerHTML = err.message;
      this._formInfo.classList.add('form__info--error');
    }
  }

  _removeErrorClassHandler() {
    this._form.addEventListener('click', this._removeErrorClass.bind(this));
  }

  _removeErrorClass(e) {
    if (!e.target.closest('.form__group__input--error')) return;
    e.target.classList.remove('form__group__input--error');
    this._formInfo.innerHTML = '';
    this._formInfo.classList.remove('form__info--error');
  }

  _addFilledClass() {
    this._form.addEventListener('change', e => {
      if (e.target.value.length === 0 || e.target.value === '')
        e.target.classList.remove('form__group__input--filled');
      else {
        e.target.classList.add('form__group__input--filled');
      }
    });
  }
  _validateEmailAddress(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  _sendEmail(name, email, phone, message) {
    try {
      return Email.send({
        SecureToken: '1b17ee09-4190-4d7c-bd83-efeb38674305',
        To: 'dawid.stud@gmail.com',
        From: email,
        Subject: 'E-mail ze stronki',
        Body: `${name}, tel: ${phone}, Wiadomość: ${message}`,
      });
    } catch (err) {
      console.log(err);
    }
  }

  _resetForm() {
    this._form.reset();
    const [...formInputs] = document.querySelectorAll('.form__group__input');

    formInputs.forEach(input => {
      input.classList.remove('form__group__input--filled');
    });

    this._formInfo.innerHTML = 'Wiadomośc została wysłana';

    setTimeout(() => {
      this._formInfo.innerHTML = '';
    }, 4000);
  }
}
new SendEmail();

// Modal
class Modal {
  _modal = document.querySelector('.modal');
  _modalContent = document.querySelector('.modal__content');
  _btnOpen = document.querySelector('.btn__open--modal');
  _btnClose = document.querySelector('.slider__btn--exit');
  _modalOverlay = document.querySelector('.modal--overlay');
  constructor() {
    this._openModalBtnHandler();
    this._closeModalBtnHandler();
    this._closeModalOverlayHandler();
    this._closeModalEscHandler();
  }

  _openModalBtnHandler() {
    this._btnOpen.addEventListener('click', () => {
      this._modal.style.visibility = 'visible';
      this._modalContent.style.height = '600px';
      this._modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      document.body.style.overflow = 'hidden';
    });
  }

  _closeModalBtnHandler() {
    this._btnClose.addEventListener('click', () => this._closeModal());
  }

  _closeModalOverlayHandler() {
    this._modalOverlay.addEventListener('click', () => this._closeModal());
  }

  _closeModalEscHandler() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' || e.key === 'Esc') this._closeModal();
    });
  }

  _closeModal() {
    this._modal.style.visibility = 'hidden';
    this._modalContent.style.height = '0px';
    this._modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    document.body.style.overflow = 'auto';
  }
}
new Modal();
