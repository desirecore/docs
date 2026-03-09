import React, {type ReactNode} from 'react';
import ComponentTypes from '@theme/NavbarItem/ComponentTypes';
import type {NavbarItemType, Props} from '@theme/NavbarItem';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function normalizeComponentType(type: NavbarItemType, props: object) {
  if (!type || type === 'default') {
    return 'items' in props ? 'dropdown' : 'default';
  }
  return type;
}

export default function NavbarItem({type, ...props}: Props): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();

  // Replace href based on locale if customProps.localeHrefs is defined
  const customProps = (props as any).customProps as
    | {localeHrefs?: Record<string, string>}
    | undefined;
  if (customProps?.localeHrefs?.[currentLocale]) {
    (props as any).href = customProps.localeHrefs[currentLocale];
  }

  const componentType = normalizeComponentType(type, props);
  const NavbarItemComponent = ComponentTypes[componentType];
  if (!NavbarItemComponent) {
    throw new Error(`No NavbarItem component found for type "${type}".`);
  }
  return <NavbarItemComponent {...(props as any)} />;
}
