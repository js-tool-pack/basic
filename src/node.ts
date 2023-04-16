export async function streamToString(stream: {
  [Symbol.asyncIterator](): AsyncIterableIterator<any>;
}) {
  const chunks: Uint8Array[] = [];
  // return new Promise<string>((resolve, reject) => {
  //   stream.on('data', (chunk) => chunks.push(chunk));
  //   stream.on('error', reject);
  //   stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  // });

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString('utf-8');
}
