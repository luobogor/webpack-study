import { getOptions } from 'loader-utils';
// https://webpack.docschina.org/contribute/writing-a-loader/
export default function loader(source) {
    const options = getOptions(this);

    source = source.replace(/\[name\]/g, options.name);

    return `export default ${ JSON.stringify(source) }`;
};

