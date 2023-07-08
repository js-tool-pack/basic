import { splitByCases } from '../splitByCases';

test('splitByCases', () => {
  const reg = /[\s!-/:-@[-`{-~]+|(?<![A-Z])(?=[A-Z])/g;
  expect(splitByCases('helloWorld')).toEqual(['hello', 'World']);
  expect(splitByCases('hello-world')).toEqual(['hello', 'world']);
  expect(splitByCases('hello-World')).toEqual(['hello', 'World']);
  expect(splitByCases('HelloWorld')).toEqual(['Hello', 'World']);
  expect(splitByCases('hello__ World')).toEqual(['hello', 'World']);
  expect(splitByCases('hello-_ World')).toEqual(['hello', 'World']);
  expect(splitByCases(' _-hello-_ World_=- ')).toEqual(['hello', 'World']);

  expect(splitByCases('AUV')).toEqual(['AUV']);
  expect(splitByCases('AUV__AUV')).toEqual(['AUV', 'AUV']);
  expect(splitByCases('Auv')).toEqual(['Auv']);
  expect(splitByCases('AUv')).toEqual(['AUv']);
  expect(splitByCases(' Auv')).toEqual(['Auv']);
  expect(splitByCases(' auv')).toEqual(['auv']);
  expect(splitByCases('-Auv')).toEqual(['Auv']);
  expect(splitByCases('_Auv')).toEqual(['Auv']);

  expect(splitByCases('a')).toEqual(['a']);
  expect(splitByCases('A')).toEqual(['A']);
  expect(splitByCases(' -_&^%$## ')).toEqual([]);

  expect(splitByCases('无hello')).toEqual(['无hello']);
  expect(splitByCases('无 hello')).toEqual(['无', 'hello']);
  expect(splitByCases('无Hello')).toEqual(['无', 'Hello']);
  expect(splitByCases('&^%%$Hello')).toEqual(['Hello']);

  expect(splitByCases('      ')).toEqual([]);

  expect(splitByCases('aBBcde-f__g ')).toEqual(['a', 'BBcde', 'f', 'g']);
  expect(splitByCases('aBBcde-f__g ')).toEqual('aBBcde-f__g '.split(reg).filter(Boolean));
});
