import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

let files = [
	'scripts.js',
];

export default files.map(function (file) {
	let name = file.replace('.js', '');
	return {
		input: `src/js/${file}`,
		output: [
			{
				file: `dist/js/${name}.js`,
				format: 'iife',
				sourcemap: true
			},
			{
				file: `dist/js/${name}.min.js`,
				format: 'iife',
				plugins: [terser()],
				sourcemap: true
			},
		],
		plugins: [nodeResolve(), commonjs()]
	};
});
