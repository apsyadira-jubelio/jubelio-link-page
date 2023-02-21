import * as React from 'react';

import clsxm from '@/lib/clsxm';

type CardBaseProps = {
	children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'div'>;

const CardBase: React.FC<CardBaseProps> = ({ className, children, ...rest }: CardBaseProps) => {
	return (
		<div className={clsxm(' w-full gap-8 overflow-hidden rounded-[20px] bg-white p-8 shadow-sm', className)} {...rest}>
			{children}
		</div>
	);
};

export default CardBase;
