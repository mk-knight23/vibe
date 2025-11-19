class VibeAiCli < Formula
  desc "Free, privacy-first AI coding assistant for the terminal"
  homepage "https://github.com/mk-knight23/vibe"
  url "https://registry.npmjs.org/vibe-ai-cli/-/vibe-ai-cli-2.1.6.tgz"
  sha256 "placeholder_for_actual_sha256" # Will be updated during release
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    assert_match "vibe version", shell_output("#{bin}/vibe --version")
  end
end