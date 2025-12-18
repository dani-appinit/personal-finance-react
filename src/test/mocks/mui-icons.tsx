import React from 'react';

const makeIcon = (name: string) => {
  const Icon: React.FC<React.ComponentProps<'span'>> = (props) => (
    <span data-testid={`icon-${name}`} {...props} />
  );
  Icon.displayName = name;
  return Icon;
};

export const AccountBalance = makeIcon('AccountBalance');
export const Email = makeIcon('Email');
export const Lock = makeIcon('Lock');
export const Visibility = makeIcon('Visibility');
export const VisibilityOff = makeIcon('VisibilityOff');
export const Add = makeIcon('Add');
export const Edit = makeIcon('Edit');
export const Delete = makeIcon('Delete');
export const Description = makeIcon('Description');
