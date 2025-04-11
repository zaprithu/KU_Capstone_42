FROM public.ecr.aws/lambda/python:3.9

RUN yum -y update \
    && yum install -y gcc gcc-c++ make pkg-config alsa-lib-devel tar xz \
    && yum clean all

RUN curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz -o /tmp/ffmpeg.tar.xz \
    && tar -xJf /tmp/ffmpeg.tar.xz -C /tmp \
    && cp /tmp/ffmpeg-*/ffmpeg /usr/local/bin/ \
    && chmod +x /usr/local/bin/ffmpeg \
    && /usr/local/bin/ffmpeg -version \
    && rm -rf /tmp/ffmpeg-*


# Install Rust for building certain Python packages
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:$PATH"

# Install Python packages
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt -t ${LAMBDA_TASK_ROOT}

# Copy handler and supporting files
COPY lambda_function.py ${LAMBDA_TASK_ROOT}
COPY output.wav ${LAMBDA_TASK_ROOT}

RUN echo "FFmpeg path:" $(command -v ffmpeg) && ffmpeg -version

CMD ["lambda_function.lambda_handler"]