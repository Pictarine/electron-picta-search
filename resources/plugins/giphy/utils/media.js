module.exports = function media (giphy) {
  const {
    id, slug,
    title,
    bitly_url: url,
    images: {
      fixed_height_small_still: smallImg,
    },
  } = giphy

  return {
    title,
    subtitle: url,
    arg: url,
    icon: { path: smallImg.url },
    context: giphy,
  }
}
