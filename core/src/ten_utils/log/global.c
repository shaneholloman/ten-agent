//
// Copyright © 2025 Agora
// This file is part of TEN Framework, an open source project.
// Licensed under the Apache License, Version 2.0, with certain conditions.
// Refer to the "LICENSE" file in the root directory for more information.
//
#include "ten_utils/ten_config.h"

#include "include_internal/ten_utils/log/level.h"
#include "include_internal/ten_utils/log/log.h"
#include "include_internal/ten_utils/log/output.h"

ten_log_t ten_global_log = {TEN_LOG_SIGNATURE,
                            TEN_LOG_LEVEL_DEBUG,
                            {ten_log_output_to_stderr, NULL, NULL}};

void ten_log_global_init(void) { ten_log_init(&ten_global_log); }

void ten_log_global_deinit(void) { ten_log_deinit(&ten_global_log); }

void ten_log_global_set_output_level(TEN_LOG_LEVEL level) {
  ten_log_set_output_level(&ten_global_log, level);
}

void ten_log_global_set_output_to_stderr(void) {
  ten_log_set_output_to_stderr(&ten_global_log);
}

void ten_log_global_set_output_to_file(const char *log_path) {
  ten_log_set_output_to_file(&ten_global_log, log_path);
}

const char *ten_log_global_get_output_file_path(void) {
  return ten_log_get_output_file_path(&ten_global_log);
}

void ten_log_global_set_encrypt_cb(ten_log_encrypt_on_encrypt_func_t cb,
                                   void *cb_data) {
  ten_log_set_encrypt_cb(&ten_global_log, cb, cb_data);
}

void ten_log_global_set_encrypt_deinit_cb(ten_log_encrypt_on_deinit_func_t cb) {
  ten_log_set_encrypt_deinit_cb(&ten_global_log, cb);
}

void ten_log_global_deinit_encryption(void) {
  ten_log_deinit_encryption(&ten_global_log);
}

void ten_log_global_reload(void) { ten_log_reload(&ten_global_log); }
