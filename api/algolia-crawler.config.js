// Algolia 管理端已发布 v5 的去密钥配置参考，供审阅和后续维护。
// 既有 Algolia 管理端保留认证，本仓不保存密钥；部署文档不自动应用此配置。
// Crawler 由 Algolia 配置运行环境提供；本文件不在站点构建中执行。
/* global Crawler */

new Crawler({
  appId: "68TB6NUYVW",
  indexPrefix: "",
  rateLimit: 8,
  maxDepth: 10,
  maxUrls: null,
  schedule: "every 1 day",
  startUrls: ["https://docs.desirecore.com"],
  renderJavaScript: false,
  sitemaps: ["https://docs.desirecore.com/sitemap.xml"],
  ignoreCanonicalTo: true,
  discoveryPatterns: ["https://docs.desirecore.com/**"],
  actions: [
    {
      indexName: "DesireCore Docs",
      pathsToMatch: ["https://docs.desirecore.com/**"],
      recordExtractor: ({ url, $, helpers }) => {
        const lvl0 =
          $(
            ".menu__link.menu__link--sublist.menu__link--active, .navbar__item.navbar__link--active",
          )
            .last()
            .text() || "Documentation";
        const splitChangelog = /^\/(?:en\/)?more\/changelog\/v10\.0\.180\/?$/.test(url.pathname);
        if (splitChangelog) {
          $("article .theme-doc-markdown ul").each((_, list) => {
            const items = $(list).children("li").toArray();
            for (let i = 0; i < items.length; i += 10) {
              const html = items.slice(i, i + 10)
                .map((item) => $(item).html() || "").join("\n");
              $(list).before($("<p></p>").html(html));
            }
            $(list).remove();
          });
        }
        return helpers.docsearch({
          recordProps: {
            lvl0: {
              selectors: "",
              defaultValue: lvl0,
            },
            lvl1: ["header h1", "article h1"],
            lvl2: "article h2",
            lvl3: "article h3",
            lvl4: "article h4",
            lvl5: "article h5, article td:first-child",
            lvl6: "article h6",
            content: "article p, article li, article td:last-child",
          },
          aggregateContent: !splitChangelog,
          recordVersion: "v3",
        });
      },
    },
  ],
  safetyChecks: { beforeIndexPublishing: { maxLostRecordsPercentage: 30 } },
  initialIndexSettings: {
    "DesireCore Docs": {
      attributesForFaceting: [
        "type",
        "lang",
        "language",
        "version",
        "docusaurus_tag",
      ],
      attributesToRetrieve: [
        "hierarchy",
        "content",
        "anchor",
        "url",
        "url_without_anchor",
        "type",
      ],
      attributesToHighlight: ["hierarchy", "content"],
      attributesToSnippet: ["content:10"],
      camelCaseAttributes: ["hierarchy", "content"],
      searchableAttributes: [
        "unordered(hierarchy.lvl0)",
        "unordered(hierarchy.lvl1)",
        "unordered(hierarchy.lvl2)",
        "unordered(hierarchy.lvl3)",
        "unordered(hierarchy.lvl4)",
        "unordered(hierarchy.lvl5)",
        "unordered(hierarchy.lvl6)",
        "content",
      ],
      distinct: true,
      attributeForDistinct: "url",
      customRanking: [
        "desc(weight.pageRank)",
        "desc(weight.level)",
        "asc(weight.position)",
      ],
      ranking: [
        "words",
        "filters",
        "typo",
        "attribute",
        "proximity",
        "exact",
        "custom",
      ],
      highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
      highlightPostTag: "</span>",
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      allowTyposOnNumericTokens: false,
      minProximity: 1,
      ignorePlurals: true,
      advancedSyntax: true,
      attributeCriteriaComputedByMinProximity: true,
      removeWordsIfNoResults: "allOptional",
    },
  },
});
