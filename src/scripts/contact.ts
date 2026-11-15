const form = document.querySelector<HTMLFormElement>('[data-contact]');
const output = form?.querySelector<HTMLElement>('.status');
const button = form?.querySelector<HTMLButtonElement>('button[type="submit"]');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!output || !button) return;
  const show = (state: 'ok' | 'error', message: string) => {
    output.dataset.state = state;
    output.textContent = message;
  };
  const fields = [
    ...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input[name], textarea',
    ),
  ];
  for (const f of fields) f.removeAttribute('aria-invalid');
  const bad = fields.filter((f) => f.name !== 'website' && !f.checkValidity());
  if (bad.length) {
    for (const f of bad) f.setAttribute('aria-invalid', 'true');
    bad[0]!.focus();
    show('error', form.dataset.invalid!);
    return;
  }
  button.disabled = true;
  button.textContent = form.dataset.sending!;
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (response.ok) {
      form.reset();
      show('ok', form.dataset.ok!);
    } else {
      show(
        'error',
        response.status === 400 ? form.dataset.invalid! : form.dataset.error!,
      );
    }
  } catch {
    show('error', form.dataset.error!);
  } finally {
    button.disabled = false;
    button.textContent = form.dataset.send!;
  }
});

if (form) form.dataset.ready = 'true';
