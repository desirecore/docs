/**
 * Swizzled: 移除 shouldRender 门控，让 MobileSidebar 始终挂载。
 * 配合 custom.css 中 1280px 断点，实现自定义响应式折叠。
 *
 * 原始组件在 windowSize !== 'mobile'（即 > 996px）时不渲染侧栏 DOM，
 * 导致 CSS-only 方案无法在 997–1279px 区间触发汉堡菜单。
 */

import React, {type ReactNode} from 'react';
import {
  useLockBodyScroll,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import NavbarMobileSidebarLayout from '@theme/Navbar/MobileSidebar/Layout';
import NavbarMobileSidebarHeader from '@theme/Navbar/MobileSidebar/Header';
import NavbarMobileSidebarPrimaryMenu from '@theme/Navbar/MobileSidebar/PrimaryMenu';
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu';

export default function NavbarMobileSidebar(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  useLockBodyScroll(mobileSidebar.shown);

  // 原始代码: if (!mobileSidebar.shouldRender) return null;
  // 移除此检查，让 DOM 始终存在，由 CSS 控制可见性
  if (mobileSidebar.disabled) {
    return null;
  }

  return (
    <NavbarMobileSidebarLayout
      header={<NavbarMobileSidebarHeader />}
      primaryMenu={<NavbarMobileSidebarPrimaryMenu />}
      secondaryMenu={<NavbarMobileSidebarSecondaryMenu />}
    />
  );
}
