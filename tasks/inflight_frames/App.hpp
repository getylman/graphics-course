#pragma once

#include <etna/Buffer.hpp>
#include <etna/Window.hpp>
#include <etna/PerFrameCmdMgr.hpp>
#include <etna/ComputePipeline.hpp>
#include <etna/Image.hpp>
#include <etna/Sampler.hpp>
#include <chrono>
#include <functional>

#include "etna/GraphicsPipeline.hpp"
#include "wsi/OsWindowingManager.hpp"

#include <etna/OneShotCmdMgr.hpp>


class App
{
public:
  App();
  ~App();

  void run();

private:
  void drawFrame();

private:
  const static constexpr size_t numFramesInFlight = 3;

  struct {
    etna::Buffer buf[numFramesInFlight];
    size_t counter{0};
  } flameBuffer;
  bool isFileTextureInit{false};

  OsWindowingManager windowing;
  std::unique_ptr<OsWindow> osWindow;

  glm::uvec2 resolution;
  bool useVsync;

  std::unique_ptr<etna::Window> vkWindow;
  std::unique_ptr<etna::PerFrameCmdMgr> commandManager;
  std::unique_ptr<etna::OneShotCmdMgr> oneShotManager;

  etna::Sampler sampler;
  etna::Image bufImage;
  etna::GraphicsPipeline pipeline;

  etna::Image grafImage;
  etna::GraphicsPipeline graphicsPipeline;

  std::chrono::system_clock::time_point timePointStart = std::chrono::system_clock::now();
};
