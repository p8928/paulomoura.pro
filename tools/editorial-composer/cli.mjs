import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { categories, savePost, slugify, todayISO } from './editorial-utils.mjs';

const rl = readline.createInterface({ input, output });

async function ask(question, fallback = '') {
  const suffix = fallback ? ` (${fallback})` : '';
  const answer = await rl.question(`${question}${suffix}: `);
  return answer.trim() || fallback;
}

async function askBody() {
  console.log('\nCole o corpo em texto simples ou Markdown. O CMS normaliza ao salvar. Finalize com uma linha contendo apenas: .fim\n');
  const lines = [];

  while (true) {
    const line = await rl.question('');
    if (line.trim() === '.fim') break;
    lines.push(line);
  }

  return lines.join('\n');
}

try {
  console.log('Composer editorial local\n');
  const title = await ask('Titulo');
  const slug = await ask('Slug', slugify(title));
  const description = await ask('Descricao');
  const category = await ask(`Categoria [${categories.join(', ')}]`, 'estrategia');
  const publishedAt = await ask('Data de publicacao YYYY-MM-DD', todayISO());
  const draftAnswer = await ask('Salvar como draft? [s/N]', 'N');
  const overwriteAnswer = await ask('Sobrescrever se existir? [s/N]', 'N');
  const body = await askBody();

  const result = await savePost({
    title,
    slug,
    description,
    category,
    publishedAt,
    draft: /^s/i.test(draftAnswer),
    overwrite: /^s/i.test(overwriteAnswer),
    body,
  });

  if (!result.ok) {
    console.error('\nNao foi possivel salvar:');
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`\nPost salvo: ${result.filePath}`);
  }
} finally {
  rl.close();
}
