// Copies text to clipboard
const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

const copyUrlToClipboard = (clickedElement) => {
    const iFrame = clickedElement.parentElement.getElementsByTagName('iframe')[0];
    const copySpan = clickedElement.parentElement.getElementsByTagName('span')[1];
    copySpan.style.opacity = 1;

    copyToClipboard(iFrame.src);
};